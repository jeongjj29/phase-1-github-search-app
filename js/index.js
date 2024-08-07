document.addEventListener("DOMContentLoaded", () => {
  const githubForm = document.querySelector("#github-form");
  const userListLi = document.querySelector("#user-list");
  const reposListLi = document.querySelector("#repos-list");
  const toggleButton = document.querySelector("#toggle-search");

  let searchMode = "users";

  toggleButton.addEventListener("click", () => {
    if (searchMode === "users") {
        searchMode = "repos";
        toggleButton.textContent = "Search Repos"
    } else if (searchMode === "repos") {
        searchMode = "users";
        toggleButton.textContent = "Search Users";
    }
    userListLi.innerHTML = "";
    reposListLi.innerHTML = "";
  });

  githubForm.addEventListener("submit", (e) => {
    e.preventDefault();

    userListLi.innerHTML = "";
    reposListLi.innerHTML = "";

    const searchQuery = githubForm.search.value;

    if (searchMode === "users") {
      fetch(`https://api.github.com/search/users?q=${searchQuery}`, {
        method: "GET",
        headers: { Accept: "application/vnd.github.v3+json" },
      })
        .then((res) => res.json())
        .then((data) => {
          const users = data.items;
          users.forEach((user) => {
            const userLi = document.createElement("li");
            const userNameP = document.createElement("p");
            userNameP.textContent = user.login;

            const userProfileP = document.createElement("p");
            const userUrl = document.createElement("a");
            userUrl.textContent = user.url;
            userUrl.href = user.url;

            const userAvatarImg = document.createElement("img");
            userAvatarImg.src = user.avatar_url;
            userAvatarImg.style.cssText = `
                border: 1px solid #ddd; 
                border-radius: 4px;
                padding: 5px;
                width: 50px;`;

            userNameP.addEventListener("click", () => {
                reposListLi.innerHTML = "";
                fetch(`https://api.github.com/users/${userName}/repos`, {
                  method: "GET",
                  headers: { Accept: "application/vnd.github.v3+json" },
                })
                  .then((res) => res.json())
                  .then((repos) => {
                    repos.forEach((repo) => {
                      const repoName = repo.name;
                      const repoUrl = repo.html_url;
                      const repoNameLi = document.createElement("li");
                      const repoUrlP = document.createElement("p");
                      const repoUrlA = document.createElement("a");
                      repoUrlP.append(repoUrlA);
                      repoUrlA.textContent = repoUrl;
                      repoUrlA.href = repoUrl;
                      repoNameLi.textContent = repoName;
                      repoNameLi.append(repoUrlP);
                      reposListLi.append(repoNameLi);
                    });
                  });
            });

            userProfileP.append(userUrl);
            userLi.append(userNameP, userProfileP, userAvatarImg);
            userListLi.append(userLi);
          });
        });
    } else if (searchMode === "repos") {
        fetch(`https://api.github.com/search/repositories?q=${searchQuery}`, {
            method: "GET",
            headers: {Accept: "application/vnd.github.v3+json"}
        })
        .then(res => res.json())
        .then(data => {
            const repos = data.items;
            repos.forEach((repo) => {
                const repoName = repo.name;
                const repoUrl = repo.html_url;
                const repoNameLi = document.createElement("li");
                const repoUrlP = document.createElement("p");
                const repoUrlA = document.createElement("a");
                repoUrlP.append(repoUrlA);
                repoUrlA.textContent = repoUrl;
                repoUrlA.href = repoUrl;
                repoNameLi.textContent = repoName;
                repoNameLi.append(repoUrlP);
                reposListLi.append(repoNameLi);
            })
        })
    }
  });
});
