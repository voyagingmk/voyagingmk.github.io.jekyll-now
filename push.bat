Xcopy  /E/C/I/Y/S/D  /exclude:excludedfileslist.txt _site ..\blog_release
cd ..\blog_release
git add -A .
git commit -m "sync"
git push origin master