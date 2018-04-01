//
//    FICHEROS:
//        index.html : My App -> title
//        manifest.json : My App -> title
//        bower.json : My App -> title, @autor -> author
//        my-app.html : 
//            String myApp -> title ??
//            ----> my-view1.html, my-view2.html", my-view3.html -> prefix + sections + .html
//            ----> name="view1",name="view2",name="view3" -> sectionsNameMenu
//            ----> href="view1",href="view2",href="view3" -> sectionsNameMenu
//            ----> VIew One, View Two, View Three -> sectionsTitle
//            ----> <my-view1 <my-view2 <my-view3 -> prefix + sections
//            ----> </my-view1> </my-view2> </my-view3> -> prefix + sections
//            ----> this.page = page || 'view1' -> this.page = page || '[    section-one   ]';
//            ----> "my-" - prefix
//            ----> window.customElements.define(MyApp.is, MyApp); -> window.customElements.define([  Class   ].is, [   Class  ]);
//        my-view1.htnl:
//            my-view1 -> prefix-sections[0]
//            MyView1 -> classNmae[0]
//        
//

var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.app.json', 'utf8'));

changeFiles = function() {
    var dir1 = 'CHANGES';
    var dir2 = 'CHANGES/src';
    if (!fs.existsSync(dir1)){ fs.mkdirSync(dir1); }
    if (!fs.existsSync(dir2)){ fs.mkdirSync(dir2); }

    var indexHtml = fs.readFileSync('index.html','utf8');
    var manifest = fs.readFileSync('manifest.json','utf8');
    var bower = fs.readFileSync('bower.json','utf8');
    var myApp =  fs.readFileSync('src/my-app.html','utf8');
    var myView = fs.readFileSync('src/my-view1.html', 'utf8');
    var myView404 = fs.readFileSync('src/my-view404.html', 'utf8');

    indexHtml = indexHtml.replace(/\s*<!--.*[^>]*-->/g, '');
    indexHtml = indexHtml.replace(/My App/g, config.title);
    manifest = manifest.replace(/My App/g, config.title);
    bower = bower.replace(/My App/g, config.title);
    bower = bower.replace(/\@autor/g, config.autor);
    myApp = myApp.replace(/\s*<!--.*[^>]*-->/g, '');
    myApp = myApp.replace(/<my-view1/, '-VIEWS-<my-view1');
    myApp = myApp.replace(/<my-view[0-9] name="view[0-9]"><\/my-view[0-9]>/g,'');
    myApp = myApp.replace(/<a name="view1"/, '-REFS-<a name="view1"');
    myApp = myApp.replace(/<a name="view[0-9]" href="\[\[rootPath\]\]view[0-9]">View\s[A-Za-z]*<\/a>/g, '');
    myApp = myApp.replace(/<link rel="lazy-import" href="my-view1/, '-LAZY-<link rel="lazy-import" href="my-view1');
    myApp = myApp.replace(/<link rel="lazy-import" href="my-view[0-9].html">/g, '');
    myApp = myApp.replace(/my-view404/g, config.prefix+'view404');
    myApp = myApp.replace(/My App/g, config.title);
    myApp = myApp.replace(/--app-primary-color: #4285f4;/,'--app-primary-color: ' + config.appPrimaryColor + ';');
    myApp = myApp.replace(/--app-secondary-color: black;/,'--app-secondary-color: ' + config.appSecondaryColor + ';');
    var views = '\n';
    var refs = '\n';
    var lazy = '\n';
    for(var i=0; i<config.sections.length; i++) {
        views += '\t\t<'+config.prefix+config.sections[i]+' name="'+config.sections[i]+'"></'+config.prefix+config.sections[i]+'>\n';
        refs += '\t\t<a name="'+config.sections[i]+'" href="[[rootPath]]'+config.sections[i]+'">'+config.sectionsNameMenu[i]+'<\/a>\n';
        lazy += '<link rel="lazy-import" href="'+config.prefix+config.sections[i]+'.html">\n';
    }
    myApp = myApp.replace(/-VIEWS-/, views);
    myApp = myApp.replace(/-REFS-/, refs);
    myApp = myApp.replace(/-LAZY-/, lazy);

    for(var i=0; i<config.sections.length; i++) {
        myApp = myApp.replace(/my-view[0-9].html/,config.prefix+config.sections[0]+'.html');
    }

    myApp = myApp.replace(/this\.page = page \|\| 'view1';/, "this.page = page || '" + config.sections[0]+"';");
    myApp = myApp.replace(/this\.resolveUrl\('my-' \+ page \+ '\.html'\);/, "this.resolveUrl('"+config.prefix+"' + page + '.html');");

    //console.log(indexHtml);
    fs.writeFile('./CHANGES/index.html', indexHtml, 'utf-8', function() { console.log('index.htnl FIXED'); });

    //console.log(manifest);
    fs.writeFile('./CHANGES/manifest.json', manifest, 'utf-8', function() { console.log('manifest.json FIXED'); });

    //console.log(bower);
    fs.writeFile('./CHANGES/bower.json', bower, 'utf-8', function() { console.log('bower.json FIXED'); });

    //console.log(myApp);
    fs.writeFile('./CHANGES/src/my-app.html', myApp, 'utf-8', function() { console.log('my-app.html FIXED'); });

    var view =myView;
    for(var i=0; i<config.sections.length; i++) {
        view =myView;
        view = view.replace(/\s*<!--.*[^>]*-->/g, '');
        view = view.replace(/<div class="circle">1<\/div>/,'');
        view = view.replace(/return 'my-view1';/, "return '"+config.prefix+config.sections[i]+"';");
        view = view.replace(/MyView1/g, config.sectionClass[i]);
        view = view.replace(/id="my-view1"/g, 'id="'+config.prefix+config.sections[i]+'"');
        view = view.replace(/View One/, config.sectionsTitle[i]);

        //console.log(view);
        fs.writeFile('./CHANGES/src/'+config.prefix+config.sections[i]+'.html', view, 'utf-8', function() { console.log('section FIXED'); });
    }

    // my-view404
    view404 = myView404;
    view404 = view404.replace(/return 'my-view404';/, "return '"+config.prefix+"view404';");
    view404 = view404.replace(/MyView404/g, config.prefixClass+'View404');
    view404 = view404.replace(/id="my-view404"/g, 'id="'+config.prefix+'view404"');
    
    console.log(view404);
    fs.writeFile('./CHANGES/src/'+config.prefix+'view404.html', view404, 'utf-8', function() { console.log('section FIXED'); });

    var dir = 'OLD';
    if (!fs.existsSync(dir)){ fs.mkdirSync(dir); }
    dir = 'OLD/src';
    if (!fs.existsSync(dir)){ fs.mkdirSync(dir); }

    // CP SEG OLD FILES
    var oldPath = './';
    var newPath = 'OLD/';
    var pre = 'my-';
    var secFiles = ['view1', 'view2', 'view3'];
    moveFiles(pre, secFiles, oldPath, newPath);

    // MOVE NEW FILES
    var oldPath = 'CHANGES/';
    var newPath = './';
    var pre = config.prefix;
    var secFiles = config.sections;
    moveFiles(pre, secFiles, oldPath, newPath);
};

revoke = function() {
    var oldPath = './';
    var newPath = 'CHANGES/';
    var pre = config.prefix;
    var secFiles = config.sections;
    moveFiles(pre, secFiles, oldPath, newPath);

    var oldPath = 'OLD/';
    var newPath = './';
    var pre = 'my-';
    var secFiles = ['view1', 'view2', 'view3'];
    moveFiles(pre, secFiles, oldPath, newPath);
};

moveFiles = function(pre, secFiles, oldPath, newPath) {
    console.log('MOVING...'); 
    console.log(oldPath + 'index.html  ->  ' + newPath + 'index.html');
    fs.renameSync(oldPath + 'index.html', newPath + 'index.html');
    console.log(oldPath + 'manifest.json  ->  ' + newPath + 'manifest.json');
    fs.renameSync(oldPath + 'manifest.json', newPath + 'manifest.json');
    console.log(oldPath + 'bower.json  ->  ' + newPath + 'bower.json');
    fs.renameSync(oldPath + 'bower.json', newPath + 'bower.json');
    console.log(oldPath + 'src/my-app.html  ->  ' + newPath + 'src/my-app.html');
    fs.renameSync(oldPath + 'src/my-app.html', newPath + 'src/my-app.html');
    for(var i=0; i<secFiles.length; i++) {
        console.log('MOVE ' + oldPath + 'src/'+pre+secFiles[i]+'.html  ->  ' + newPath + 'src/'+pre+secFiles[i]+'.html');
        fs.renameSync(oldPath + 'src/'+pre+secFiles[i]+'.html', newPath + 'src/'+pre+secFiles[i]+'.html');
    }
    console.log('MOVE ' + oldPath + 'src/'+pre+'view404.html  ->  ' + newPath + 'src/'+pre+'view404.html');
    fs.renameSync(oldPath + 'src/'+pre+'view404.html', newPath + 'src/'+pre+'view404.html');
}

if (process.argv[2] === undefined) {
    changeFiles();
}
if (process.argv[2] === 'revoke') {
    revoke();
}