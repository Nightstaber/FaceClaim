<?php
$db = new PDO('sqlite:../database/gallery.sqlite');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$action = $_GET['action'] ?? '';

header('Content-Type: application/json');

if ($action === 'upload' && isset($_FILES['image'])) {
    $filename = basename($_FILES['image']['name']);
    move_uploaded_file($_FILES['image']['tmp_name'], '../gallery/uploads/' . $filename);

    $stmt = $db->prepare("INSERT INTO images (filename) VALUES (?)");
    $stmt->execute([$filename]);
    $image_id = $db->lastInsertId();

    foreach(['Køn','Alder','Hårfarve','Kendetegn'] as $cat){
        if(!empty($_POST[$cat])){
            $stmt = $db->prepare("INSERT INTO tags (image_id, category, value) VALUES (?,?,?)");
            $stmt->execute([$image_id, $cat, $_POST[$cat]]);
        }
    }
    echo json_encode(['success'=>true]);
}

elseif($action === 'delete' && isset($_GET['id'])){
    $id = (int)$_GET['id'];
    $stmt = $db->prepare("SELECT filename FROM images WHERE id=?");
    $stmt->execute([$id]);
    $file = $stmt->fetchColumn();
    if($file) unlink('../gallery/uploads/'.$file);

    $stmt = $db->prepare("DELETE FROM images WHERE id=?");
    $stmt->execute([$id]);

    echo json_encode(['success'=>true]);
}

elseif($action === 'list'){
    $stmt = $db->query("SELECT * FROM images");
    $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach($images as &$img){
        $stmt = $db->prepare("SELECT category,value FROM tags WHERE image_id=?");
        $stmt->execute([$img['id']]);
        $tags = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
        $img['tags'] = $tags;
    }

    echo json_encode($images);
}

else{
    echo json_encode(['error'=>'Invalid action']);
}
?>
