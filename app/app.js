function refreshTable(path){
var request = new XMLHttpRequest();
request.open('GET', path, true);
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

var currentPath = null;

//everything about this is bad.
function constructTable(data){
  tab = document.createElement('table');
  for(file in data){
    tr = document.createElement('tr');
    if(data[file].IsDirectory){
      path = '/files?path='+data[file].Path
      tr.setAttribute("onclick","refreshTable('"+path+"'); currentPath = '"+data[file].Path+"';");
      var icon = document.createElement('td');
      icon.innerHTML="<i class='fa fa-folder'></i>"
    }
    else{
      rstr = '';
      if (data.Root) {
        rstr = 'r=' + data[file].Root + '&';
      }
      path = '/b?'+rstr+'f='+data[file].Path
      tr.setAttribute("onclick","window.location = '"+path+"';");
      var icon = document.createElement('td');
      icon.innerHTML="<i class='fa "+getFileIcon(data[file].Ext) + "'></i>"
    }
    var name = document.createElement('td');
    name.appendChild(document.createTextNode(data[file].Name));
    var size = document.createElement('td');
    size.appendChild(document.createTextNode(data[file].Size ? data[file].Size : ''));
    var modified = document.createElement('td');
    modified.appendChild(document.createTextNode(new Date(data[file].Modified).toDateString()));
    tr.appendChild(icon);
    tr.appendChild(name);
    tr.appendChild(size);
    tr.appendChild(modified);
    tab.appendChild(tr);
  }
  document.getElementById('directory-viewer').innerHTML = '';
  document.getElementById('directory-viewer').appendChild(tab);
  console.log(currentPath);
}

refreshTable('/files')

document.getElementById('up').addEventListener("click",  function(){
  if (!currentPath) return;
  var idx = currentPath.lastIndexOf("/");
  var path = currentPath.substr(0, idx);
  var request = new XMLHttpRequest();
  request.open('GET', '/files?path='+ path, true);
  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      var data = JSON.parse(this.response);
      constructTable(data);
      currentPath = path;
    } else {

    }
  };
  request.onerror = function() {
  };
  request.send();
});
