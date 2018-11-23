var example = (function() {

    "use strict";

    var scene = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    var light = new THREE.AmbientLight(0xffffff);
    var camera;
    var box;

    var mesh;

    function initScene() {
        renderer.setSize( window.innerWidth, window.innerHeight );
        //renderer.shadowMapEnabled = true;

        document.getElementById('webgl-container').appendChild(renderer.domElement);

        //light.castShadow = true;
        scene.add(light);

        var newLight = new THREE.DirectionalLight(new THREE.Color("#ffffff"));
        newLight.position.set(0,0,0);

        scene.add(newLight);

        camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        camera.position.z = 100;
        scene.add( camera );

        
        
        box = new THREE.Mesh(
            new THREE.BoxGeometry(20,20,20),
            new THREE.MeshBasicMaterial({color: 0xFF0000})
            );
            
            box.name = "box";
            
            scene.add(box);

            var geometry = new THREE.CubeGeometry( 1000, 1000, 1000 );
            var cubeMaterials =
            [
                new THREE.MeshBasicMaterial({color: 0xFF0000}),
                new THREE.MeshBasicMaterial({color: 0xFF0000}),
                new THREE.MeshBasicMaterial({color: 0xFF0000}),
                new THREE.MeshBasicMaterial({color: 0xFF0000}),
                new THREE.MeshBasicMaterial({color: 0xFF0000}),
                new THREE.MeshBasicMaterial({color: 0xFF0000}),
            ];
            // Create a MeshFaceMaterial, which allows the cube to have different materials on each face
            var cubeMaterial = new THREE.MeshFaceMaterial( cubeMaterials );
            var cube = new THREE.Mesh( geometry, cubeMaterial );
            scene.add( cube );
            
            var material = new THREE.MeshBasicMaterial({
                vertexColors: THREE.VertexColors,
                side: THREE.DoubleSide
            });
            
        var triangleGeometry = new THREE.Geometry();
        triangleGeometry.vertices.push(new THREE.Vector3(0.0, 1.0, 0.0));
        triangleGeometry.vertices.push(new THREE.Vector3(-1.0, -1.0, 0.0));
        triangleGeometry.vertices.push(new THREE.Vector3(1.0, -1.0, 0.0));

        triangleGeometry.faces.push(new THREE.Face3(0, 1, 2));

        triangleGeometry.faces[0].vertexColors[0] = new THREE.Color(0xFF0000);
        triangleGeometry.faces[0].vertexColors[1] = new THREE.Color(0x00FF00);
        triangleGeometry.faces[0].vertexColors[2] = new THREE.Color(0xFF0000);

        var manualGeometry = new THREE.Mesh(triangleGeometry, material);

        var exporter = new THREE.GeometryExporter();
        var exporterObject = exporter.parse(manualGeometry.geometry);
        var serializedExportedObject = JSON.stringify(exporterObject);

        console.log(serializedExportedObject);
        console.log(JSON.stringify(serializedExportedObject));

        var loader = new THREE.JSONLoader();
        var model = loader.parse(JSON.parse(serializedExportedObject));

        mesh = new THREE.Mesh(model.geometry, material);
        //mesh.castShadow = true;

        //scene.add(mesh);

        //scene.add(manualGeometry);


        render();
    }

    function render() {
        box.rotation.y += 0.01;
        
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    function onDocumentMouseDown(event) {
        var projector = new THREE.Projector();

        var mouseClickVector =
        new THREE.Vector3(
            (event.clientX / window.innerWidth) * 2 - 1,
            (event.clientY / innerHeight) * 2 + 1,
            0,5
        );

        projector.unprojectVector(mouseClickVector, camera);

        var raycaster = new THREE.Raycaster(
            camera.position,
            mouseClickVector.sub(camera.position).normalize()
        );

        var intersects = raycaster.intersectObjects(objects);

        if (intersects.length > 0) {
            intersects[0].object.meterial.color.setHex(Math.random() * 0xffffff);
        }
    }

    function checkKey(e) {

        var left = 37,
            up = 38,
            right = 39,
            down = 40,
            increment = 1;

        e = e || window.event;

        if (e.keyCode == up) {
            camera.position.z -= increment;
        } else if (e.keyCode == down) {
            camera.position.z += increment;
        } else if (e.keyCode == left) {
            camera.position.x -= increment;
        } else if (e.keyCode == right) {
            camera.position.x += increment;
        }
    }

    window.addEventListener('resize', function(){
        var width = window.innerWidth;
        var height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    window.onkeydown = checkKey;

    window.onload = initScene;

    //window.addEventListener('mousedown', onDocumentMouseDown, false);

    return {
        scene: scene
    };

}());