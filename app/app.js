//Handles the creation and population of directory viewer and breadcrumb
function refreshTable(path){
  //directory view refresh
  var request = new XMLHttpRequest();
  request.open('GET', '/files?path=' + path, true);
  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      var data = JSON.parse(this.response);
      constructTable(data);
    } else {
    }
  };
  request.onerror = function() {
  };
  request.send();
  //set new current Path
  currentPath = path;
  //
  breadcrumb = document.getElementById('breadcrumb');
  while (breadcrumb.hasChildNodes()) { //Need to do this to remove all elements and their events.
    breadcrumb.removeChild(breadcrumb.firstChild);
  }
  //home link
  a = document.createElement("li")
  a.className = 'home';
  a.setAttribute("onclick", "refreshTable('');");
  a.textContent = 'Home';
  breadcrumb.appendChild(a);
  //everything else
  arr = path.split("/")
  vpath = '';
  arr.some((p) => {
    if (p == '') {
      return;
    }
    vpath = vpath + '/' + p;
    a = document.createElement("li")
    a.setAttribute("onclick", "refreshTable('"+vpath+"');");
    a.textContent = p;
    breadcrumb.appendChild(a);
  });
  vpath = '';
};

var extensionsMap = {
              ".zip" : "fa-file-archive-o",
              ".gz" : "fa-file-archive-o",
              ".bz2" : "fa-file-archive-o",
              ".xz" : "fa-file-archive-o",
              ".rar" : "fa-file-archive-o",
              ".tar" : "fa-file-archive-o",
              ".tgz" : "fa-file-archive-o",
              ".tbz2" : "fa-file-archive-o",
              ".z" : "fa-file-archive-o",
              ".7z" : "fa-file-archive-o",
              ".mp3" : "fa-file-audio-o",
              ".cs" : "fa-file-code-o",
              ".c++" : "fa-file-code-o",
              ".cpp" : "fa-file-code-o",
              ".js" : "fa-file-code-o",
              ".xls" : "fa-file-excel-o",
              ".xlsx" : "fa-file-excel-o",
              ".png" : "fa-file-image-o",
              ".jpg" : "fa-file-image-o",
              ".jpeg" : "fa-file-image-o",
              ".gif" : "fa-file-image-o",
              ".mpeg" : "fa-file-movie-o",
              ".pdf" : "fa-file-pdf-o",
              ".ppt" : "fa-file-powerpoint-o",
              ".pptx" : "fa-file-powerpoint-o",
              ".txt" : "fa-file-text-o",
              ".log" : "fa-file-text-o",
              ".doc" : "fa-file-word-o",
              ".docx" : "fa-file-word-o",
            };

function getFileIcon(ext) {
  return ( ext && extensionsMap[ext.toLowerCase()]) || 'fa-file-o';
}

//everything about this is bad.
function constructTable(data){
  tab = document.createElement('table');
  for(file in data){
    tr = document.createElement('tr');
    if(data[file].IsDirectory){
      tr.setAttribute("onclick","refreshTable('"+data[file].Path+"');");
      var icon = document.createElement('td');
      icon.innerHTML="<i class='fa fa-folder'></i>"
    }
    else{
      rstr = '';
      if (data.Root) {
        rstr = 'r=' + data[file].Root + '&';
      }
      tr.setAttribute("onclick","window.location = '" + '/b?'+rstr+'f='+data[file].Path +"';");
      var icon = document.createElement('td');
      icon.innerHTML="<i class='fa "+getFileIcon(data[file].Ext) + "'></i>"
    }
    var name = document.createElement('td');
    name.appendChild(document.createTextNode(data[file].Name));
    var del = document.createElement('td');
    del.setAttribute("onclick","event.stopPropagation(); deleteFileOrFolder('"+data[file].Path+"');");
    del.innerHTML="<i class='fa fa-apple'></i>"
    tr.appendChild(icon);
    tr.appendChild(name);
    tr.appendChild(del);
    tab.appendChild(tr);
  }
  document.getElementById('directory-viewer').innerHTML = '';
  document.getElementById('directory-viewer').appendChild(tab);
}


document.getElementById('up').addEventListener("click",  function(){
  if (!currentPath) return;
  var idx = currentPath.lastIndexOf("/");
  var path = currentPath.substr(0, idx);
  refreshTable(path);
});

//Drag and drop upload
let directoryViewer = document.getElementById('directory-viewer');

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  directoryViewer.addEventListener(eventName, preventDefaults, false)
})

directoryViewer.addEventListener('drop', onFilesDrop, false)

function onFilesDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files
  files = [...files];
  files.forEach(uploadFile)
}

function uploadFile(file) {
  var xhr = new XMLHttpRequest()
  var formData = new FormData()
  xhr.open('POST', '/upload', true)
  xhr.addEventListener('readystatechange', function(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // Done. Inform the user
    }
    else if (xhr.readyState == 4 && xhr.status != 200) {
      // Error. Inform the user
    }
  })
  formData.append('file', file)
  formData.append('directory', currentPath)
  xhr.send(formData)
}

function deleteFileOrFolder(f) {
  var xhr = new XMLHttpRequest()
  var formData = new FormData()
  xhr.open('POST', '/delete', true)
  xhr.addEventListener('readystatechange', function(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // Done. Inform the user
    }
    else if (xhr.readyState == 4 && xhr.status != 200) {
      // Error. Inform the user
    }
  })
  formData.append('f', f)
  xhr.send(formData)
}

var currentPath = null;
refreshTable('')
