        
        document.addEventListener('DOMContentLoaded', async () => {
            const isLogged = localStorage.getItem('isLoggedIn') === 'true';
            if(isLogged===false){
                window.location.href = '/';
                
            }
            const body = document.body;
            const logo = document.getElementById('logo');
            const profile = document.getElementById('profile');
            const darkThemeLogo = '../logo.png'; // Logo for dark theme
            const lightThemeLogo = '../black_logo_corrected.png';
            const toggler = document.getElementById('theme-toggle');
            const isDarkTheme = toggler ? toggler.checked === false : true;
            const menuBar = document.querySelector('.content nav .bx.bx-menu');
            const sideBar = document.querySelector('.sidebar');
            const searchBtn = document.querySelector('.search-btn'); 
            const searchForm = document.querySelector('.search-form'); 
            const searchBtnIcon = searchBtn.querySelector('.bx'); 

            

            updateTheme(isDarkTheme);

            if (window.innerWidth < 768) {
                sideBar.classList.add('close');
            }

            menuBar.addEventListener('click', () => {
                sideBar.classList.toggle('close');
            });

            window.addEventListener('resize', () => {
                if (window.innerWidth < 768) {
                    sideBar.classList.add('close');
                } else {
                    sideBar.classList.remove('close');
                }

                if (window.innerWidth > 576) {
                    searchBtnIcon.classList.replace('bx-x', 'bx-search');
                    searchForm.classList.remove('show');
                }
            });

            searchBtn.addEventListener('click', function (e) {
                if (window.innerWidth < 576) {
                    e.preventDefault();
                    searchForm.classList.toggle('show');
                    if (searchForm.classList.contains('show')) {
                        searchBtnIcon.classList.replace('bx-search', 'bx-x');
                    } else {
                        searchBtnIcon.classList.replace('bx-x', 'bx-search');
                    }
                }
            });



            await getDocument("dashboard.html");
            await fetchLevelData();
            await fetchUserData();
            updateDashboardContent();
            document.title = userName;
            
            function updateTheme(isDark) {
                if (isDark) {
                    body.classList.add('dark');
                    logo.src = darkThemeLogo;
                } else {
                    body.classList.remove('dark');
                    logo.src = lightThemeLogo;
                }
            }

            if (toggler) {
                toggler.addEventListener('change', function () {
                    updateTheme(!this.checked);
                });
            }
        });
        const lgoButton  = document.getElementById("logoutbutton");
        lgoButton.addEventListener("click",async(e)=>{
          await localStorage.removeItem("isLoggedIn");
          window.location.href("/");
        })
        // Side menu event listeners
        const sideLinks = document.querySelectorAll('.sidebar .side-menu li a:not(.logout)');
        const urlMapping = {
            "Dashboard": "dashboard.html",
            "Courses": "navbar-items/courses.html",
            "Analytics": "navbar-items/analytics.html",
            "Chatlar": "chats.html",
            "Users": "navbar-items/users.html",
            "Settings": "navbar-items/settings.html"
        };
        const userID = localStorage.getItem('userId');
        const LocaluserType = localStorage.getItem('userType');
        let image, userName, appeal_phone_number, userLocation, bio, manager_name, manager_phone_number, create_date, update_date, manager_password, login, password, userType,currentIncomeID;
        let income , expense , clearIncome;
        let studentList = [];
        let coursesList = [];
        let teachersList = [];
        let groupList = [];
        let isLoading = false;
        let chatUserId;
        let lcenterID,workerName,workerImage;
        sideLinks.forEach(item => {
            const li = item.parentElement;
            item.addEventListener('click', async (e) => {
                e.preventDefault(); // Prevent the default link behavior

                // Remove 'active' class from all menu items
                sideLinks.forEach(i => i.parentElement.classList.remove('active'));

                // Add 'active' class to the clicked menu item
                li.classList.add('active');

                // Update the URL based on the menu item text
                const menuItemText = item.textContent.trim();
                const newUrl = urlMapping[menuItemText];

                if (newUrl) {
                    await getDocument(newUrl);
                    

                    if (menuItemText === "Dashboard") {
                        await fetchUserData();
                        updateDashboardContent();
                        // Ensure the dashboard is properly loaded
                    }
                    if(menuItemText==="Chatlar"){
                        updateChatsContent();
                    }       
                }
            });
        });
        async function fetchLevelData() {
            isLoading=true;
            try{
                const response = await fetch(Secret.URL+"workers/");
                if(!response.ok){
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                for (const user of data) {
                    console.log('Checking user:', user); // Log each client being checked
                    if (user.workerRole.toString()===LocaluserType&&user.id.toString() === userID) {
                        lcenterID = user.lcenterID;
                        workerName  = user.workerName;
                        workerImage = user.workerImage;
                        break;
                    }
                }
            }catch{

            }
        }
        let requestsList = [];
        let chatRoomsList;
        async function fetchUserData() {
            isLoading = true;
            try {
                const response = await fetch(Secret.URL + 'clients/');
                const lcenterdetailsresponse = await fetch(Secret.URL + 'lcenterdetail/');
                const coursesresponse = await fetch(Secret.URL + "courses/");
                const requestResponse = await fetch(Secret.URL + "request-to-study/");
                const teacherResponse = await fetch(Secret.URL + "teachers/");
                const groupResponse = await fetch(Secret.URL + "groups/");
                const financeResponse = await fetch(Secret.URL + "lcenterincome/");
                const rTypes = await fetch(Secret.URL + "request-types/");
                const chatRoomsResponse = await fetch(Secret.URL + "chat-room/");
                const chatUserResponse = await fetch(Secret.URL + "chat-user/");
        
                if (!response.ok || !lcenterdetailsresponse.ok || !coursesresponse.ok ||
                    !requestResponse.ok || !teacherResponse.ok || !groupResponse.ok || 
                    !financeResponse.ok || !rTypes.ok || !chatRoomsResponse.ok ||
                    !chatUserResponse.ok) {
                    throw new Error('Network response was not ok');
                }
        
                const data = await response.json();
                const lcenterdetails = await lcenterdetailsresponse.json();
                const coursesdata = await coursesresponse.json();
                const requestsdata = await requestResponse.json();
                const teacherData = await teacherResponse.json();
                const groupData = await groupResponse.json();
                const financeData = await financeResponse.json();
                const requestTypesData = await rTypes.json();
                const chatRoomsData = await chatRoomsResponse.json();
                const chatUserData = await chatUserResponse.json();
        
                console.log('API Data:', data); // Log the raw data
                console.log('Chat Rooms Data:', chatRoomsData); // Log the chat rooms data
        
                for (const chatuser of chatUserData) {
                    if (chatuser.userID.toString() === userID.toString()) {
                        chatRoomsList = chatRoomsData.filter(chatroom => chatroom.roomUsers.includes(chatuser.id));
                        chatUserID = chatuser.id;
                    }
                }
        
                for (const client of data) {
                    if (client.id.toString() === lcenterID.toString()) {
                        image = client.image;
                        userName = client.name;
                        appeal_phone_number = client.appeal_phone_number;
                        userLocation = client.location;
                        bio = client.bio;
                        manager_name = client.manager_name;
                        manager_phone_number = client.manager_phone_number;
                        create_date = client.create_date;
                        update_date = client.update_date;
                        manager_password = client.manager_password;
                        login = client.login;
                        password = client.password;
                        userType = client.userType;
                        currentIncomeID = client.currentIncomeId;
                        console.log(userName); // Log the userName after it's set
                        break;
                    }
                }
        
                for (const finance of financeData) {
                    if (finance.id.toString() === currentIncomeID.toString()) {
                        income = finance.income;
                        expense = finance.expense;
                        clearIncome = finance.clearIncome;
                        break;
                    }
                }
        
                studentList = lcenterdetails.filter(detail => detail.learningCenterId.toString() === lcenterID.toString());
                coursesList = coursesdata.filter(course => course.lcenterID.toString() === lcenterID.toString());
                requestsList = requestsdata.filter(request => request.lcenterId.toString() === lcenterID.toString());
                teachersList = teacherData.filter(teacher => teacher.learningCenterID.toString() === lcenterID.toString());
                groupList = groupData.filter(group => group.lcenterID.toString() === lcenterID.toString());
                requestTypesList = requestTypesData.filter(requesttypes => requesttypes.lcenterId.toString() === lcenterID.toString());
                chatUserList = chatUserData;
                console.log('StudentList:', studentList);
                console.log(lcenterID);
                isLoading = !(lcenterdetails && data);
            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        }
        
        
    let requestTypesList = [] 
        function getDocument(url) {
            return fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    return response.text();
                })
                .then(html => {
                    console.log(html); // Log the HTML content
                    document.getElementById('item').innerHTML = html;
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        }
        function generateTableRows(data,types) {
            const tbody = document.querySelector('tbody');
            tbody.innerHTML = ''; // Clear previous content
        
            data.forEach(item => {
                let providerName; // Convert status to lowercase for class
                for (a of types){
                    if(a.id===item.requestProvider){
                      providerName=a.request_type_name;
                      
                    }
                }
            
                // Create table row dynamically
                const row = `
                    <tr>
                        <td><p>${item.name}</p></td>
                        <td>${item.phoneNumber}</td>
                        <td class="provider_value"><span class="provider">${providerName}</span></td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        }
        function generateChatRows(data) {
            const tbody = document.querySelector('.task-list');
            tbody.innerHTML = ''; // Clear previous content
        
            data.forEach(item => {
                
            
                // Create table row dynamically
                const row = `
                     <li class="completed">
                        <div class="task-title">
                            <i class='bx bx-message-square-dots'></i>
                            <p>${item.roomName}</p>
                        </div>
                        </li>
                `;
                tbody.innerHTML += row;
            });
        };
        let teacher_name;
        let group_name;
        let chatType;
        let chatUsersList;

        function generateChatListRows(data) {
            const tbody = document.querySelector('.chat-list_rows');
            tbody.innerHTML = ''; // Clear previous content
            
            data.forEach(item => {
                let groupName;
                let teacherId;
                let teacherName;
               
            for(a of groupList){
                if(a.chatId===item.id){
                  groupName=a.groupName;
                  teacherId = a.teacherID;
                }
            }
            for(b of teachersList){
                if(b.id===teacherId){
                  teacherName=b.teacherName;
                }
               }
                // Create table row dynamically
                const row = `
                    <li class="completed">
                        <div class="task-title">
                            <i class='bx bx-message-square-dots'></i>
                            <p>${item.roomName}</p>
                        </div>
                        <i class='bx bx-dots-vertical-rounded'></i> <!-- Add the icon here -->
                        <p class="info_text">(Guruh : ${groupName} ; Ustoz : ${teacherName}; Guruh a'zolari soni : ${item.roomUsers.length})</p>
                    </li>
                `;
                tbody.innerHTML += row;

                const chatItems = document.querySelectorAll('.chat-list_rows li');
                chatItems.forEach(chatItem => {
                    chatItem.addEventListener('click', async function () {
                        // Get the clicked chat's ID
                        console.log(item.chatType)
                        chatId = item.id;
                        teacher_name =teacherName;
                        group_name = item.roomName;
                        chatType = item.chatType;
                        chatUsersList = item.roomUsers;
                        
                        console.log('Selected Chat ID:', chatId); // Log chat ID for debugging
            
                        // Fetch the chat.html document and load the chat content
                        await getDocument('chat.html');
            
                        // You can add logic to display chat messages based on the chatId
                        // Example: Call a function to update chat messages for this chatId
                        updateChatContent(chatId);
                    });
                });
            });
        }
        
        function updateDashboardContent() {
            
            const profile = document.getElementById('profile');
            const clientNameElement = document.getElementById('clientName');
            const studentCount = document.getElementById('studentCount');
            const requestCount = document.getElementById("request-content");
            const courseCount = document.getElementById('courses-content');
            const teacherCount = document.getElementById('teachers-content');
            const groupCount = document.getElementById('groups-content');
            const incomeCount = document.getElementById('income-content');
            const expenseCount = document.getElementById('expenses-content');
            const clearIncomeCount = document.getElementById('clear-income-content');

            if (studentCount&&courseCount&&profile&&clientNameElement&&requestCount&&teacherCount&&groupCount&&incomeCount&&expenseCount&&clearIncomeCount) {
                studentCount.textContent = studentList.length; // Use the length property
                courseCount.textContent = coursesList.length; // Use the length property
                profile.src = workerImage;
                clientNameElement.textContent = userName;
                requestCount.textContent = requestsList.length;
                groupCount.textContent = groupList.length; // Use the length property
                teacherCount.textContent = teachersList.length; 
                incomeCount.textContent = income+".000";
                expenseCount.textContent = expense+".000";
                clearIncomeCount.textContent = clearIncome+".000";
                generateTableRows(requestsList,requestTypesList);
                generateChatRows(chatRoomsList);
            } else {
                console.error('Element with ID "clientName" not found.');
            }
            const dashboardContent = document.querySelector(".dashboard-content");
            const loadingContent = document.querySelector(".loading-content");
            // Hide loading content and show dashboard content
            if (loadingContent && dashboardContent) {
                loadingContent.style.display = 'none';
                dashboardContent.style.display = 'block';
            }
            const chatsnavigator = document.getElementById("chat_navigator");
            chatsnavigator.addEventListener("click", (e) => {
                e.preventDefault();
                
                // Simulate a click on the "Chatlar" menu item
                const chatlarMenuItem = Array.from(sideLinks).find(item => item.textContent.trim() === "Chatlar");
                if (chatlarMenuItem) {
                    // Remove 'active' class from all menu items
                    sideLinks.forEach(i => i.parentElement.classList.remove('active'));
                    
                    // Add 'active' class to "Chatlar"
                    chatlarMenuItem.parentElement.classList.add('active');
                    
                    // Fetch the "Chatlar" content
                    getDocument(urlMapping["Chatlar"]).then(async() => {
                        
                        updateChatsContent();  // Ensure chat content is updated
                    });
                }
            });
        }
        
        let chatId;
        let chatUserID;
        async function updateChatsContent() {
            await fetchUserData();
            const chatContent = document.querySelector(".chat-content");
            const loadingContent = document.querySelector(".loading-content");
            
            if (loadingContent && chatContent) {
                loadingContent.style.display = 'none';
                chatContent.style.display = 'block';
            }
            
               
                generateChatListRows(chatRoomsList);
           
        }
        let chatUserList;
        async function updateChatContent(chatRoomId) {
           
            const tbody = document.querySelector('.user-list');
            const countUser = document.getElementById("chat-user-count");
            let userCount = 0; // Use number, not array
            const lcentername = document.getElementById("lcenter_profile");
            const chatName = document.getElementById("name_profile");
            const chatTypeContent = document.getElementById("chatType");
            const teacherNameContent = document.getElementById("teacher_name");
            
            if(lcentername&&chatName&&chatTypeContent&&teacherNameContent){
                lcentername.textContent = userName;
                chatName.textContent = group_name;
                teacherNameContent.textContent = teacher_name;
                if(chatType==="STUDENTS"){
                    chatTypeContent.textContent = "O'quvchilar"
                }else if(chatType==="MANAGMENT"){
                    chatTypeContent.textContent = "Boshqarma"
                }else if(chatType==="PARENTS"){
                    chatTypeContent.textContent = "Parents"
                }else{
                    chatTypeContent.textContent = "Aniqlanmadi"
                }
                
            }
            // Clear previous content
              // Clear the previous user list content
            chatUserList.forEach(item => {
                console.log(chatUsersList, chatUserList); // Debugging to check data
                if (chatUsersList.includes(item.id)) {
                    const row = `
                        <div class="user-chat-preview">
                            <img src="${item.userImage}" alt="User Image">
                            <div class="listtile">
                                <h4>${item.username}</h4>
                                <i class='bx bx-user-minus'></i>
                            </div>
                        </div>
                    `;
                    tbody.innerHTML += row;
                    userCount += 1; // Increment user count
                }
            });
        
            if (countUser) {
                countUser.textContent = userCount;
            } else {
                console.log("Element not found");
            }
        
            const messageListContainer = document.getElementById('message-list');
            const messageInput = document.getElementById('message-input');
            const sendMessageButton = document.getElementById('send-message');
            const backbutton = document.getElementById("back_to_chat_list");
            const littlebackbutton = document.getElementById("back_to_chat");
            littlebackbutton.addEventListener("click", async (e) => {
                await getDocument(urlMapping["Chatlar"]);
                updateChatsContent(); // Ensure chat content is updated
            });
            backbutton.addEventListener("click", async (e) => {
                await getDocument(urlMapping["Chatlar"]);
                updateChatsContent(); // Ensure chat content is updated
            });
        
            let lastMessageId = 0; // Track the ID of the last received message
            const receivedMessageIds = new Set(); // Track received message IDs to avoid duplication
        
            function fetchNewMessages() {
                fetch(`${Secret.URL}/get-new-messages/?last_message_id=${lastMessageId}&roomId=${chatRoomId}`)
                    .then(response => response.json())
                    .then(data => {
                        if (Array.isArray(data)) {
                            let newMessagesFetched = false;
                            data.forEach(message => {
                                if (!receivedMessageIds.has(message.id) && Number(message.roomId) === chatRoomId) {
                                    const messageOwner = chatUserList.find(user => user.id === message.messageOwner);
        
                                    if (messageOwner) {
                                        const messageElement = document.createElement('div');
                                        messageElement.className = 'message-wrapper';
        
                                        const profileImageContainer = document.createElement('div');
                                        profileImageContainer.className = 'profile-image-container';
                                        const profileImage = document.createElement('img');
                                        profileImage.className = 'profile-image';
                                        profileImage.src = messageOwner.userImage || 'default-profile-image.png';
                                        profileImageContainer.appendChild(profileImage);
        
                                        const messageContainer = document.createElement('div');
                                        messageContainer.className = 'message-container';
                                        const messageContent = document.createElement('div');
                                        messageContent.className = 'message-content';
                                        messageContent.innerText = message.content;
                                        messageContainer.appendChild(messageContent);
        
                                        messageElement.appendChild(profileImageContainer);
                                        messageElement.appendChild(messageContainer);
        
                                        if (message.messageOwner === chatUserID) {
                                            messageElement.classList.add('message-sent');
                                            profileImageContainer.classList.add('sent');
                                            messageContainer.classList.add('sent');
                                        } else {
                                            messageElement.classList.add('message-received');
                                            profileImageContainer.classList.add('received');
                                            messageContainer.classList.add('received');
                                        }
        
                                        messageListContainer.appendChild(messageElement);
                                        receivedMessageIds.add(message.id);
                                        lastMessageId = Math.max(lastMessageId, message.id);
                                        newMessagesFetched = true;
                                    }
                                }
                            });
        
                            if (newMessagesFetched) {
                                scrollToBottom();
                            }
                        } else {
                            console.error('Unexpected data format:', data);
                        }
        
                        setTimeout(fetchNewMessages, 1000); // Poll again after 1 second
                    })
                    .catch(error => {
                        console.error('Error fetching new messages:', error);
                        setTimeout(fetchNewMessages, 5000); // Retry after a delay on error
                    });
            }
        
            function sendMessage() {
                const messageContent = messageInput.value;
        
                if (!messageContent) return;
        
                sendMessageButton.classList.add('loading');
                sendMessageButton.textContent = "Sending";
                sendMessageButton.style.width = "60px";
                sendMessageButton.style.borderRadius = "10px";
        
                fetch(`${Secret.URL}/chat-message/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        roomId: chatRoomId,
                        content: messageContent,
                        messageOwner: chatUserID,
                    }),
                })
                .then(response => response.json())
                .then(() => {
                    messageInput.value = "";
                    scrollToBottom();
                })
                .catch(error => console.error('Error sending message:', error))
                .finally(() => {
                    sendMessageButton.classList.remove('loading');
                    sendMessageButton.textContent = "Send";
                    sendMessageButton.style.width = "45px";
                    sendMessageButton.style.borderRadius = "50%";
                });
            }
        
            function scrollToBottom() {
                messageListContainer.scrollTop = messageListContainer.scrollHeight;
            }
        
            sendMessageButton.addEventListener('click', sendMessage);
            fetchNewMessages(); // Start long polling
        }
        
        
        
        
        // document.oncontextmenu = () =>{
        //     return false
        // }
        // document.onkeydown = e =>{
        //     if(e.key === "F12"){
        //         return false
        //     }
        // }