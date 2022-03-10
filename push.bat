
git add -A .
git commit -m "sync"
git push origin master
Xcopy  .\_site ..\blog_release  /E/C/I/Y/S/D  /exclude:excludedfileslist.txt
Xcopy  .\_site\index.html ..\blog_release\index.html /Y
