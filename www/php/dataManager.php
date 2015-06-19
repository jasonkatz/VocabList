<?php
    $requestType = $_GET['type'];
    if ($requestType == 'getWords') {
        echo "[{\"word\":\"test\", \"definition\":\"one\"}]";
    } elseif ($requestType == 'addWord') {
        echo "[{\"word\":\"added\", \"definition\":\"word\"}]";
    }
?>
