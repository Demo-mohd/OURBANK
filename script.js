let users = {}; // كائن لتخزين المستخدمين وكلمات مرورهم
let members = {};
let currentUser = null; // المتغير لتتبع المستخدم الحالي
let isFirstLogin = true;

// تحميل البيانات من localStorage عند بدء التطبيق
function loadData() {
    const storedUsers = localStorage.getItem('users');
    const storedMembers = localStorage.getItem('members');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    }
    if (storedMembers) {
        members = JSON.parse(storedMembers);
    }
}

// حفظ البيانات في localStorage
function saveData() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('members', JSON.stringify(members));
}

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (isFirstLogin) {
        if (password) {
            users[username] = password; // تخزين كلمة المرور للمستخدم
            currentUser = username; // تعيين المستخدم الحالي
            isFirstLogin = false;
            showWelcomeScreen();
        } else {
            alert("يرجى إدخال كلمة مرور.");
        }
    } else {
        // التحقق من اسم المستخدم وكلمة المرور
        if (users[username] && password === users[username]) {
            currentUser = username;
            showWelcomeScreen();
        } else {
            document.getElementById("errorMessage").innerText = "اسم المستخدم أو كلمة المرور غير صحيحة.";
        }
    }
}

function showWelcomeScreen() {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("welcomeScreen").style.display = "block";
    setTimeout(() => {
        document.getElementById("welcomeScreen").style.display = "none";
        document.getElementById("appSection").style.display = "block";
    }, 3000); // 3 ثواني
}

function setPassword() {
    const newPassword = document.getElementById("newPassword").value;
    const username = document.getElementById("username").value; // الحصول على اسم المستخدم
    if (newPassword) {
        users[username] = newPassword; // تحديث كلمة المرور للمستخدم
        document.getElementById("setupSection").style.display = "none";
        document.getElementById("appSection").style.display = "block";
        saveData(); // حفظ البيانات
    } else {
        alert("يرجى إدخال كلمة مرور جديدة.");
    }
}

function logout() {
    currentUser = null; // إعادة تعيين المستخدم الحالي
    document.getElementById("appSection").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
    document.getElementById("username").value = '';
    document.getElementById("password").value = '';
}

function resetPassword() {
    const newPassword = prompt("أدخل كلمة المرور الجديدة:");
    if (newPassword) {
        users[currentUser] = newPassword; // تحديث كلمة المرور للمستخدم الحالي
        saveData(); // حفظ البيانات
        alert("تم إعادة تعيين كلمة المرور بنجاح.");
    }
}

function addMember() {
    const name = document.getElementById("memberName").value;
    if (name && !members[name]) {
        members[name] = 0;
        document.getElementById("memberName").value = '';
        renderMembers();
        saveData(); // حفظ البيانات
    } else {
        alert("يرجى إدخال اسم غير مكرر.");
    }
}

function removeMember(name) {
    delete members[name];
    renderMembers();
    saveData(); // حفظ البيانات
}

function addAmount(name) {
    const amount = parseInt(prompt("أدخل المبلغ لإضافته:"));
    if (!isNaN(amount)) {
        members[name] += amount;
        renderMembers();
        saveData(); // حفظ البيانات
    }
}

function removeAmount(name) {
    const amount = parseInt(prompt("أدخل المبلغ لحذفه:"));
    if (!isNaN(amount)) {
        members[name] -= amount;
        renderMembers();
        saveData(); // حفظ البيانات
    }
}

function renderMembers() {
    const membersList = document.getElementById("membersList");
    membersList.innerHTML = '';

    let totalAmount = 0;

    for (const name in members) {
        totalAmount += members[name];
        const memberDiv = document.createElement("div");
        memberDiv.className = "member";
        memberDiv.innerHTML = `
            <span>${name}: ${members[name]} جنيهاً</span>
            <button onclick="addAmount('${name}')">إضافة</button>
            <button onclick="removeAmount('${name}')">حذف</button>
            <button onclick="removeMember('${name}')">إزالة</button>
        `;
        membersList.appendChild(memberDiv);
    }

    // تحديث اسم الفرد الحالي
    if (Object.keys(members).length > 0) {
        document.getElementById("currentMemberName").innerText = Object.keys(members)[0]; // افتراض اسم أول فرد
    } else {
        document.getElementById("currentMemberName").innerText = "اسم الفرد";
    }

    document.getElementById("totalAmount").innerText = totalAmount;
}

function saveChanges() {
    alert("تم حفظ التحديثات بنجاح.");
    saveData(); // حفظ البيانات
}

// تحميل البيانات عند بدء التطبيق
loadData();
