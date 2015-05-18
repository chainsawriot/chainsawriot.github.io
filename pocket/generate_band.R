require(metafor)
require(stringr)
require(googlesheets) # not a/v from CRAN yet, need to install via github
require(dplyr)

"https://docs.google.com/spreadsheets/d/1B6Ox2hzeuWxQ7I853N58zBGKKUSyKijYsVV_bV59MDw/edit#gid=0" %>% gs_url %>% get_via_csv %>% as.data.frame(stringsAsFactors = FALSE) -> pocket 
pocket <- pocket[pocket[,3]==1 & !is.na(pocket[,3]),]
pocket[,11] <- as.numeric(pocket[,11])
pocket[str_trim(pocket[,7]) == '三大', 11] <- pocket[str_trim(pocket[,7]) == '三大', 11] / 5

yi <- as.numeric(pocket[,15]) / 100
vi <- (yi*(1-yi)) / (as.numeric(pocket[,11]) - 1)

metavi <- weights(rma(yi=yi, vi=vi, slab=paste(str_trim(pocket[,8]), pocket[,5]), method="REML"))

loessdat <- data.frame(y = yi, x = as.Date(pocket[,5], format="%m/%d/%Y"))
loessfit <- loess(y~as.numeric(x), weights = metavi, data=loessdat, span=0.75)
plx <- predict(loessfit, newdata = as.numeric(seq(from = min(loessdat$x), to = max(loessdat$x), by = 1)), se = TRUE)

smoothed <- data.frame(date=seq(from = min(loessdat$x), to = max(loessdat$x), by = 1), loessfit = plx$fit, loessmin = plx$fit + qt(0.975, plx$df)*plx$se, loessmax = plx$fit - qt(0.975, plx$df)*plx$se)

write.csv(smoothed, "smoothed.csv", row.names = FALSE)
write.csv(pocket, "pocketdata.csv", row.names = FALSE)
