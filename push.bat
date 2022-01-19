Xcopy  /E/C/I/Y/S/D  /exclude:excludedfileslist.txt _site ..\blog_release
git add -A .
git commit -m "111"
git push origin master