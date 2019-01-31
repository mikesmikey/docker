GIT 
Command line instructions

Git global setup
git config --global user.name "Your Name"
git config --global user.email "Your Email"

Create a new repository
git clone https://gitlab.com/yourgit/nmw.git
cd redcrud
touch README.md
git add README.md
git commit -m "add README"
git push -u origin master

Existing folder
cd existing_folder
git init
git remote add origin https://gitlab.com/yourgit/nmw.git
git add .
git commit -m "Initial commit"
git push -u origin master

Existing Git repository
cd existing_repo
git remote rename origin old-origin
git remote add origin https://gitlab.com/yourgit/nmw.git
git push -u origin --all
git push -u origin --tags