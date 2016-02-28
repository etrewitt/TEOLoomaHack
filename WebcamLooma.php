<? php

if (isset($GLOBALS["HTTP_RAW_POST_DATA"])) {
  $imageData=$GLOBALS['HTTP_RAW_POST_DATA'];
  $filteredData=substr($imageData, strpos($imageData, ",")+1);
  $unencodedData=base64_decode($filteredData);
  $fp = fopen('/uploads/looma/some_file_name.png', 'wb' );
  fwrite( $fp, $unencodedData);
  fclose( $fp );
}
/*
  //uploading file   
            $savedImage = $_GET["stillCanvas"];
  			//$savedVideo = $_POST["videoCanvas"];
        
    
            $file1 = $_POTST'']['tmp_name'];
            
            $destination = "./uploads/" . $_POST[""][""];
            
            if (move_uploaded_file($file1, $destination)) {
                echo "The file ". $_FILES["file1"]["name"] . " has been uploaded.";
            }
            else {
                echo "Sorry, there was an error uploading your file.";
                return;
            }
            
        }
 
	echo .$savedImage. ;
	echo .$savedVideo. ;
*/
 ?>