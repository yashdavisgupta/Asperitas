var modal = document.getElementById("modal");
var close = document.getElementById("modal-close");
var dirData = '';
var moveSource = '';
var moveDest = '';
//Handles the creation and population of directory viewer and breadcrumb
function refreshDirectoryViewer(path){
  //directory view refresh
  var request = new XMLHttpRequest();
  request.open('GET', '/files?path=' + path, true);
  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      dirData = JSON.parse(this.response);
      constructTable(dirData);
    } else {
    }
  };
  request.onerror = function() {
  };
  request.send();
  //set new current Path
  currentPath = path;
  var breadcrumb = document.getElementById('breadcrumb');
  breadcrumb.innerHTML = '';
  //home link
  a = document.createElement("li")
  a.className = 'home';
  a.setAttribute("ondblclick", "refreshDirectoryViewer('');");
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
    a.setAttribute("ondblclick", "refreshDirectoryViewer('"+vpath+"');");
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
      tr.setAttribute("ondblclick", "refreshDirectoryViewer('"+data[file].Path+"');");
      tr.setAttribute("path", data[file].Path);
      var icon = document.createElement('td');
      icon.innerHTML="<i class='fa fa-folder'></i>"
    }
    else{
      rstr = '';
      if (data.Root) {
        rstr = 'r=' + data[file].Root + '&';
      }
      tr.setAttribute("ondblclick","window.location = '" + '/b?'+rstr+'f='+data[file].Path +"';");
      tr.setAttribute("path", data[file].Path);
      var icon = document.createElement('td');
      icon.innerHTML="<i class='fa "+getFileIcon(data[file].Ext) + "'></i>"
    }
    var name = document.createElement('td');
    name.appendChild(document.createTextNode(data[file].Name));
    var del = document.createElement('td');
    var move = document.createElement('td');
    tr.appendChild(icon);
    tr.appendChild(name);
    del.setAttribute("onclick","event.stopPropagation(); deleteFileOrFolder('./"+data[file].Path+"');");
    del.innerHTML="<i class='fa fa-apple'></i>"
    move.setAttribute("onclick","event.stopPropagation(); moveTo('./"+data[file].Path+"');");
    move.innerHTML="<i class='fa fa-arrow-right'></i>"
    tr.appendChild(del);
    tr.appendChild(move);
    tab.appendChild(tr);
  }
  document.getElementById('directory-viewer').innerHTML = '';
  document.getElementById('directory-viewer').appendChild(tab);
}

document.getElementById('up').addEventListener("click",  function(){
  if (!currentPath) return;
  var idx = currentPath.lastIndexOf("/");
  var path = currentPath.substr(0, idx);
  refreshDirectoryViewer(path);
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

function moveModalPopulate(path){
  //directory view refresh
  var request = new XMLHttpRequest();
  request.open('GET', '/files?path=' + path, true);
  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      data = JSON.parse(this.response);
      tab = document.createElement('table');
      for(file in data){
        tr = document.createElement('tr');
        if(data[file].IsDirectory){
          tr.setAttribute("onclick", "moveModalPopulate('./"+data[file].Path+"');");
          tr.setAttribute("path", data[file].Path);
          var icon = document.createElement('td');
          icon.innerHTML="<i class='fa fa-folder'></i>"
          var name = document.createElement('td');
          name.appendChild(document.createTextNode(data[file].Name));
          tr.appendChild(icon);
          tr.appendChild(name);
          tab.appendChild(tr);
        }
      }
      up = document.createElement('span');
      icon = document.createElement('i');
      up.className = 'up';
      icon.className = 'fa fa-level-up'
      up.addEventListener("click",  function(){
        if (!currentMovePath) return;
        var path = currentMovePath.substr(0, currentMovePath.lastIndexOf("/"));
        moveModalPopulate(path);
      });
      up.appendChild(icon);
      var ret = document.createElement('div');
      ret.appendChild(breadcrumb);
      ret.appendChild(up);
      ret.appendChild(tab);
      document.getElementById('modal-content').innerHTML = ''
      document.getElementById('modal-content').append(ret);
    } else {
    }
  };
  request.onerror = function() {
  };
  request.send();
  //set new current Path
  currentMovePath = path;
  moveDest = currentMovePath;
  var breadcrumb = document.createElement('ul')
  breadcrumb.className = "breadcrumb"
  //home link
  a = document.createElement("li")
  a.className = 'home';
  a.setAttribute("onclick", "moveModalPopulate('');");
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
    a.setAttribute("onclick", "moveModalPopulate('"+vpath+"');");
    a.textContent = p;
    breadcrumb.appendChild(a);
  });
  vpath = '';
};

// When the user clicks on <span> (x), close the modal
document.getElementById('modal-close').onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function moveTo(source) {
  moveSource = source
  directory = source.substr(0, source.lastIndexOf("/"));
  content = moveModalPopulate(directory);
  modal.style.display = "block";
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

function moveFileOrFolder(source, destination) {
  var xhr = new XMLHttpRequest()
  var formData = new FormData()
  xhr.open('POST', '/move', true)
  xhr.addEventListener('readystatechange', function(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // Done. Inform the user
    }
    else if (xhr.readyState == 4 && xhr.status != 200) {
      // Error. Inform the user
    }
  })
  formData.append('s', source)
  formData.append('d', destination)
  xhr.send(formData)
}

var currentPath = null;
var currentMovePath = null;
refreshDirectoryViewer('')
