require(rio)
require(lubridate)
require(dplyr)
require(stringr)


read.csv("~/pocket-meta-analysis/pocketdatanew.csv", stringsAsFactors = FALSE) -> pocket
colnames(pocket) <- c("origin", "notes", "incl", "daterel", "datestart", "dateend", "org", "sponsor", "responserate", "weighted", "samplesize", "age60", "age50", "question", "support", "against")

pocket %>% filter(incl == 1) %>% arrange(mdy(datestart)) %>% mutate(org = str_trim(org), sponsor = str_trim(sponsor), uni = ifelse(str_detect(org, "大"), 1, 0), question = str_replace_all(question, "[  ]", "")) %>% select(-notes) %>% export("pocketsorted.csv")

