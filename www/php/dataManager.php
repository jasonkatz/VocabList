<?php
    $requestType = $_GET['type'];
    $data = file_get_contents('../data/data.json');
    if ($requestType == 'getDictionaries') {
        loadDictionaries($data);
    } elseif ($requestType == 'getWords') {
        loadWords($data);
    } elseif ($requestType == 'addWord') {
        addWord($data);
    } elseif ($requestType == 'deleteWord') {
        deleteWord($data);
    } 

    function loadDictionaries($data) {
        $dataDecoded = json_decode($data, true);
        header('HTTP/1.1 200 OK');
        header('Content-Type: application/json');
        header('Cache-Control: no-cache');
        $results = array();
        foreach ($dataDecoded as $index => $obj) {
            foreach ($obj as $objKey => $objVal) {
                if ($objKey == 'dictionaryId') {
                    $id = $objVal;
                } elseif ($objKey == 'name') {
                    $name = $objVal;
                }
            }
            $newObj = array(
                "id" => $id,
                "name" => $name
            );
            array_push($results, $newObj);
        }
        echo json_encode($results, JSON_PRETTY_PRINT);
    }

    function loadWords($data) {
        $dataDecoded = json_decode($data, true);
        header('HTTP/1.1 200 OK');
        header('Content-Type: application/json');
        header('Cache-Control: no-cache');
        foreach ($dataDecoded as $index => $obj) {
            $correctObject = false;
            foreach ($obj as $objKey => $objVal) {
                if ($objKey == 'dictionaryId' && $objVal == $_POST['currentDictionaryId']) {
                    $correctObject = true;
                } elseif ($objKey == 'words' && $correctObject) {
                    echo json_encode($objVal, JSON_PRETTY_PRINT);
                }
            }
        }
    }

    function addWord($data) {
        $dataDecoded = json_decode($data, true);
        $dataDecoded[] = ['id'         => getNewId(),
                          'word'       => $_POST['word'],
                          'definition' => $_POST['definition']];
        $data = json_encode($dataDecoded, JSON_PRETTY_PRINT);
        file_put_contents('../data/data.json', $data);
        header('HTTP/1.1 200 OK');
        header('Content-Type: application/json');
        header('Cache-Control: no-cache');
        echo $data;
    }

    function deleteWord($data) {
        $dataDecoded = json_decode($data, true);
        $deleting = null;
        foreach ($dataDecoded as $index => $obj) {
            foreach ($obj as $objKey => $objVal) {
                if ($objKey == 'id' && $objVal == $_POST['id']) {
                    $deleting = $obj;
                    unset($dataDecoded[$index]);
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
        $data = json_encode($dataDecoded, JSON_PRETTY_PRINT);
        file_put_contents('../data/data.json', $data);
        header('HTTP/1.1 200 OK');
        header('Content-Type: application/json');
        header('Cache-Control: no-cache');
        echo $data;
    }

    function getNewId() {
        if (function_exists('com_create_guid') === true) {
            return trim(com_create_guid(), '{}');
        }
        return sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(16384, 20479), mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
    }
?>
