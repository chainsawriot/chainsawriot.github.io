cp index_theme.html index.html
Rscript generate_band.R
Rscript sorting.R
echo `date` | tee -a index.html
echo '</body></html>' | tee -a index.html
git commit -am $1
git push origin master
