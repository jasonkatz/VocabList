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
        $dataDecoded = json_decode($data);
        $results = array();
        foreach ($dataDecoded as $obj) {
            $newObj = array(
                "id" => $obj->dictionaryId,
                "name" => $obj->name 
            );
            array_push($results, array("id" => $obj->dictionaryId, "name" => $obj->name));
        }
        header('HTTP/1.1 200 OK');
        header('Content-Type: application/json');
        header('Cache-Control: no-cache');
        echo json_encode($results, JSON_PRETTY_PRINT);
    }

    function loadWords($data) {
        $dataDecoded = json_decode($data);
        $dictionaryFound = false;
        foreach ($dataDecoded as $obj) {
            if ($obj->dictionaryId == $_POST['currentDictionaryId']) {
                $dictionaryFound = true;
                header('HTTP/1.1 200 OK');
                header('Content-Type: appliction/json');
                header('Cache-Control: no-cache');
                echo json_encode($obj->words, JSON_PRETTY_PRINT);
                return;
            }
        }
        if (!$dictionaryFound) {
            $error = json_encode(array(
                'errorMessage' => 'Error loading words: dictionary id ' . $_POST['currentDictionaryId'] . ' not found'
            ));
            //error_log($error);
            header('HTTP/1.1 500 Internal Server Error');
            header('Content-Type: application/json');
            header('Cache-Control: no-cache');
            echo $error;
            return;
        }
    }

    function addWord($data) {
        $dataDecoded = json_decode($data);
        $dictionaryFound = false;
        foreach ($dataDecoded as $index => $obj) {
            if ($obj->dictionaryId == $_POST['currentDictionaryId']) {
                $dictionaryFound = true;
                array_push($dataDecoded[$index]->words, ['id'            => getNewId(),
                                                         'word'          => $_POST['word'],
                                                         'definition'    => $_POST['definition']]);
                file_put_contents('../data/data.json', json_encode($dataDecoded, JSON_PRETTY_PRINT));
                header('HTTP:/1.1 200 OK');
                header('Content-Type: appliction/json');
                header('Cache-Control: no-cache');
                echo json_encode($obj->words, JSON_PRETTY_PRINT);
                return;
            }
        }
        if (!$dictionaryFound) {
            $error = json_encode(array(
                'errorMessage' => 'Error adding word: dictionary id ' . $_POST['currentDictionaryId'] . ' not found'
            ));
            error_log($error);
            header('HTTP/1.1 500 Internal Server Error');
            header('Content-Type: application/json');
            header('Cache-Control: no-cache');
            echo $error;
            return;
        }
    }

    function deleteWord($data) {
        $dataDecoded = json_decode($data);
        $deleting = null;
        foreach ($dataDecoded as $dictionaryIndex => $obj) {
            if ($obj->dictionaryId == $_POST['currentDictionaryId']) {
                foreach ($obj->words as $wordIndex => $word) {
                    if ($word->id == $_POST['id']) {
                        $deleting = $word;
                        unset($dataDecoded[$dictionaryIndex]->words[$wordIndex]);
                        $dataDecoded[$dictionaryIndex]->words = array_values($dataDecoded[$dictionaryIndex]->words);
                    }
                }
            }
        }
        if ($deleting == null) {
            $error = json_encode(array(
                'errorMessage' => 'Error deleting: id ' . $_POST['id'] . ' not found'
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
        foreach ($dataDecoded as $obj) {
            if ($obj->dictionaryId == $_POST['currentDictionaryId']) {
                echo json_encode($obj->words);
                return;
            }
        }
    }

    function getNewId() {
        if (function_exists('com_create_guid') === true) {
            return trim(com_create_guid(), '{}');
        }
        return sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(16384, 20479), mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
    }
?>
