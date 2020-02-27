@echo Going to put files to archive
@pause
@7z a -i!css\tk.css -x!js\knockout*.js -ttar -mx0 -r wxclientko_src.tar *.js *.html
@7z l wxclientko_src.tar
@pause
