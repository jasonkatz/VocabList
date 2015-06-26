<?php
    $requestType = $_GET['type'];
    $words = file_get_contents('../data/data.json');
    if ($requestType == 'getWords') {
        loadWords($words);
    } elseif ($requestType == 'addWord') {
        addWord($words);
    } elseif ($requestType == 'deleteWord') {
        deleteWord($words);
    }

    function loadWords($words) {
        header('HTTP/1.1 200 OK');
        header('Content-Type: application/json');
        header('Cache-Control: no-cache');
        echo $words;
    }

    function addWord($words) {
        $wordsDecoded = json_decode($words, true);
        $wordsDecoded[] = ['id'         => getNewId(),
                           'word'       => $_POST['word'],
                           'definition' => $_POST['definition']];
        $words = json_encode($wordsDecoded, JSON_PRETTY_PRINT);
        file_put_contents('../data/data.json', $words);
        header('HTTP/1.1 200 OK');
        header('Content-Type: application/json');
        header('Cache-Control: no-cache');
        echo $words;
    }

    function deleteWord($words) {
        $wordsDecoded = json_decode($words, true);
        $deleting = null;
        foreach ($wordsDecoded as $index => $obj) {
            foreach ($obj as $objKey => $objVal) {
                if ($objKey == 'id' && $objVal == $_POST['id']) {
                    $deleting = $obj;
                    unset($wordsDecoded[$index]);
                }
            }
        }
        if ($deleting == null) {
            $error = json_encode(array(
                'errorMessage' => 'Error deleting: id not found'
            ));
            error_log($error);
            header('HTTP/1.1 500 Internal Server Error');
            header('Content-Type: application/json');
            header('Cache-Control: no-cache');
            echo $error;
            return;
        }
        $words = json_encode($wordsDecoded, JSON_PRETTY_PRINT);
        file_put_contents('../data/data.json', $words);
        header('HTTP/1.1 200 OK');
        header('Content-Type: application/json');
        header('Cache-Control: no-cache');
        echo $words;
    }

    function getNewId() {
        if (function_exists('com_create_guid') === true) {
            return trim(com_create_guid(), '{}');
        }
        return sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(16384, 20479), mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
    }
?>
