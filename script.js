document.addEventListener('DOMContentLoaded',function(){

    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-cards");

    function validateUsername(username) {
        if(username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if(!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }

    function updateProgress(label,totalQuestion,solvedQuestion,progressCircle){
        const progressDegree = (solvedQuestion/totalQuestion)*100;
        progressCircle.style.setProperty("--progress-degree", `${progressDegree}%`);
        label.textContent = `${solvedQuestion}/${totalQuestion}`;
    }

    async function fetchUserDetails(username) {

        const url = `https://leetcode-api-faisalshohag.vercel.app/${username}`;

        try {

            searchButton.textContent = "Searching...";
            searchButton.disabled = true;

            const response = await fetch(url);
            const data = await response.json();
            console.log(data);
            
            const easySolved = data.easySolved;
            const mediumSolved = data.mediumSolved;
            const hardSolved = data.hardSolved;

            const totalEasy = data.totalEasy;
            const totalMedium = data.totalMedium;
            const totalHard = data.totalHard;

            console.table([easySolved,mediumSolved,hardSolved,totalEasy,totalMedium,totalHard]);

            updateProgress(easyLabel,totalEasy,easySolved,easyProgressCircle);
            updateProgress(mediumLabel,totalMedium,mediumSolved,mediumProgressCircle);
            updateProgress(hardLabel,totalHard,hardSolved,hardProgressCircle);
            
            const cardsData = [
                {
                    label: 'Overall Submissions:',
                    value: data.totalSubmissions[0].submissions,
                },
                {
                    label: 'Easy Submissions:',
                    value: data.totalSubmissions[1].submissions,
                },
                {
                    label: 'Medium Submissions:',
                    value: data.totalSubmissions[2].submissions,
                },
                {
                    label: 'Hard Submissions:',
                    value: data.totalSubmissions[3].submissions,
                }
            ]

            console.log(cardsData);

            cardStatsContainer.innerHTML = cardsData.map(
                data => 
                        `<div class="card">
                        <h4>${data.label}</h4>
                        <p>${data.value}</p>
                        </div>`
            ).join("")
    

            
        } catch (error) {
            // console.log(error.message)
            statsContainer.innerHTML = `<p>${error.message}</p>`
        }

        finally{
            searchButton.textContent = "Search";
            searchButton.disabled = false;
        }
    }

    searchButton.addEventListener('click',function(){
        const username = usernameInput.value;
        if(validateUsername(username)){
            fetchUserDetails(username);
        }

    })
})