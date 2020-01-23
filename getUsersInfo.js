var FBID = location.pathname.split('/')[1];
var referrer = '';
var widgetJSON = [];
var aUsersId = [];
var saveUsersInfo = [];
var widgetHTML = "";
var usersListHTML = "";
var index = 1;
var limiter = false;
var appContent = document.querySelectorAll("#appContent")[0];
var sidebar = document.querySelectorAll('div[data-test-id="sidebar"]')[0];
// 上传的数据格式 主要是value定义了小部件的值
var dataUp = {
  q: "",
  filter: {
    operator: "AND",
    groups: [
      {
        operator: "AND",
        items: [
          {
            _oid: "",
            type: "widget",
            field: "widget",
            operator: "IS",
            value: 000000
          }
        ]
      }
    ]
  }
};
// 获取小部件的属性值
function getWidgetValue() {
  fetch("https://manychat.com/"+FBID+"/subscribers/segments", {
    method: "GET",
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36",
      "Content-Type": "application/json"
    },
    referrer: referrer
  })
    .then(response => response.json())
    .then(data => {
      if (data.state) {
        data.segments.map(segment => {
          if (segment.type == "widget" && segment.active) {
            widgetJSON.push({
              type: segment.label,
              value: segment.value,
              count: segment.count
            });
          }
        });
      }

      // 处理 widgetJSON 生成 HTML
      for (let a in widgetJSON) {
        widgetHTML += `
                <tr>
                    <th scope="row">${a}</th>
                    <td>${widgetJSON[a].type}</td>
                    <td>${widgetJSON[a].value}</td>
                    <td>${widgetJSON[a].count}</td>
                    <td><button id="get-Btn-${a}" type="button" class="btn btn-primary btn-sm" onclick="getUsersId(${widgetJSON[a].value}, '', ${a})">开始</button></td>
                    <td><button style="pointer-events:none" id="print-Btn-${a}"  type="button" class="btn btn-secondary btn-sm disabled" onclick="loopUserInfo(aUsersId, ${a})">等待</button></td>
                </tr>
            `;
      }
      innerHTML();
    });
}
getWidgetValue();

// 插入自定义的HTML
function innerHTML() {
  var getBootstrap =
    '<style>.img-box{width: 50px; height: 50px;padding: 2px!important;}img{width: 100%;height: 100%; border-radius: 50%;object-fit: cover;}</style><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">';
  var widgetList = `
        <div id="widget" class="container" style="margin-bottom:20px">
            <div class="row">
                <div class="col-8">
                    <table class="table">
                        <thead class="thead-light">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">工具名称</th>
                            <th scope="col">值</th>
                            <th scope="col">数量</th>
                            <th scope="col">获取</th>
                            <th scope="col">输出</th>
                        </tr>
                        </thead>
                        <tbody>
                            ${widgetHTML}
                        </tbody>
                    </table>
                    <div id="progress-box" class="progress d-none">
                      <div id="progress" class="progress-bar" role="progressbar"></div>
                    </div>
                </div>
                <div class="col-4">
                    <ul class="list-group">
                      <li class="list-group-item active">使用说明</li>
                      <li class="list-group-item">1. 点击“获取”列的按钮，约2秒后“输出”列按钮呈可用状态；</li>
                      <li class="list-group-item">2. 点击“输出”列按钮输出数据，会出现进度条指示输出进度；</li>
                      <li class="list-group-item">3. 进度条结束后，数据会以表格形式输出。可以把数据复制到 Google sheet 进一步操作；</li>
                      <li class="list-group-item list-group-item-warning">4. 操作中请不要刷新页面，如误操作请重复1-3条。</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
  var usersList = `
        <div id="usersList" class="container d-none" style="max-width: 98%;">
        <div class="row">
            <div class="col-xl">
                <table class="table table-hover">
                    <thead class="thead-light">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col" colspan="2">姓名</th>
                            <th scope="col">头像</th>
                            <th scope="col">性别</th>
                            <th scope="col">订阅时间</th>
                            <th scope="col">地区</th>
                            <th scope="col">语言</th>
                            <th scope="col" colspan="3">来源渠道</th>
                            <th scope="col" colspan="3">来源值</th>
                        </tr>
                    </thead>
                    <tbody id="usersListBody"> </tbody>
                </table>
            </div>
        </div>
    </div>
    `;
  appContent.innerHTML = getBootstrap + widgetList + usersList;
}

function innerUserListHTML() {
  let oUsersListBody = document.querySelector("#usersListBody");
  oUsersListBody.innerHTML = usersListHTML;
}

// 获取用户的 id 参数 value 小部件的value  limiterValue 极限值
function getUsersId(value, limiterValue, a) {
  limiter ? '' : aUsersId.length = 0;
  let valueS = value;
  sidebar.style.zIndex = "-1";
  dataUp.filter.groups[0].items[0].value = value;
  fetch(
    `https://manychat.com/${FBID}/subscribers/search${limiterValue}`,
    {
      method: "POST", // or 'PUT'
      body: JSON.stringify(dataUp), // data can be `string` or {object}!
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      referrer: referrer
    }
  )
    .then(response => response.json())
    .then(data => {
      if (data.state) {
        limiter = data.limiter;
        data.users.map(user => {
          aUsersId.push(user.user_id);
          // getUserInfo(user.user_id)
        });
        if (limiter) {
          getUsersId(valueS, "?limiter=" + limiter, '');
          return
        }
      }
    });
  
  setTimeout(() => {
    let oGetBtn = document.querySelector(`#get-Btn-${a}`);
    let oPintBtn = document.querySelector(`#print-Btn-${a}`);
    oGetBtn.innerText = '完成';
    oGetBtn.classList.remove('btn-primary');
    oGetBtn.classList.add('disabled', 'btn-success');
    oGetBtn.style.pointerEvents = 'none';
    oPintBtn.innerText = '开始';
    oPintBtn.style.pointerEvents = '';
    oPintBtn.classList.remove('disabled', 'btn-secondary', 'btn-warning');
    oPintBtn.classList.add('btn-success');
  }, 2e3)
}

function loopUserInfo(arr, a) {
  let oGetBtn = document.querySelector(`#get-Btn-${a}`);
  let oPintBtn = document.querySelector(`#print-Btn-${a}`);
  if (arr.length == 0) {
    result = window.confirm('🔔数据已经输出，你想重新获取吗？');
    if (result) {
      oGetBtn.innerText = '开始';
      oGetBtn.classList.add('btn-primary');
      oGetBtn.classList.remove('disabled', 'btn-success');
      oGetBtn.style.pointerEvents = '';
      oPintBtn.innerText = '等待';
      oPintBtn.classList.add('disabled', 'btn-secondary');
      oPintBtn.classList.remove('btn-success', 'btn-warning');
      init();
    }
    return;
  }
  let per = 0;
  let i = 0;
  let length = arr.length;
  let oProgressBox = document.querySelector('#progress-box');
  let oProgress = document.querySelector('#progress');
  let oUsersList = document.querySelector('#usersList');
  let oUsersListBody = document.querySelector("#usersListBody");
  oProgressBox.classList.remove('d-none');
  oUsersList.classList.add('d-none');
  oUsersListBody.innerHTML = '';
  
  let flag = setInterval(function () {
    getUserInfo(arr[i++]);
    per = parseInt(i / length * 100);
    oProgress.style.width = `${per}%`;
    oProgress.setAttribute('aria-valuenow', per );
    oProgress.setAttribute('aria-valuemin', 0);
    oProgress.setAttribute('aria-valuemax', length);
    oProgress.innerText = `${per}%`;
    if (i >length) {
      clearInterval(flag);
      innerUserListHTML();
      init();
      oUsersList.classList.remove('d-none');
      oPintBtn.innerText = '完成&重新开始';
      oPintBtn.classList.remove('btn-success');
      oPintBtn.classList.add('btn-warning');
    }
  }, 500);
}

function init(){
  aUsersId.length = 0;
  saveUsersInfo.length = 0;
  index = 1;
  usersListHTML = '';
  let oProgressBox = document.querySelector('#progress-box');
  oProgressBox.classList.add('d-none');
}
// 获取用户详细信息 参数 userId 用户的id值
function getUserInfo(userId) {
  fetch(
    "https://manychat.com/"+FBID+"/subscribers/details?user_id=" +
      userId,
    {
      method: "GET",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36",
        "Content-Type": "application/json"
      },
      referrer: referrer
    }
  )
    .then(response => response.json())
    .then(uI => {
      if (uI.state) {
        saveUsersInfo.push({
          num: index++,
          name: uI.user.name,
          avatar: uI.user.avatar,
          raw_ts_added: uI.user.raw_ts_added,
          gender: uI.user.gender,
          locale: uI.user.locale,
          language: uI.user.language,
          widgets: uI.user.widgets.map(i => i.tag_name),
          fields: uI.user.fields.map(i => i.value)
        });
      }
    });
  saveUsersInfoFun(saveUsersInfo);
}

// 保存用户详细信息 生成 html
function saveUsersInfoFun(arr) {
  usersListHTML = "";
  arr.map(i => {
    usersListHTML += `
            <tr>
                <th scope="row">${i.num}</th>
                <td colspan="2">${i.name}</td>
                <td class="text-center img-box">
                    <img src="${i.avatar}">
                </td>
                <td >${i.gender}</td>
                <td>${new Date(Number(String(i.raw_ts_added).substring(0, 13)))
                  .toISOString()
                  .substring(0, 10)}</td>
                <td>${i.locale}</td>
                <td>${i.language}</td>
                <td colspan="3">${i.widgets ? i.widgets.join("<br>") : ""}</td>
                <td colspan="3">${i.fields ? i.fields.join("<br>") : ""}</td>
            </tr>
        `;
  });
}
