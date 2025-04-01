import {
  helloVoid,
  helloError,
  helloStr,
  helloNum,
  helloArrayStr,
  helloObj,
} from "../utils/samples";
export { helloError, helloStr, helloNum, helloArrayStr, helloObj, helloVoid };
import { dispatchTS } from "../utils/utils";

export const qeDomFunction = () => {
  if (typeof qe === "undefined") {
    app.enableQE();
  }
  if (qe) {
    qe.name;
    qe.project.getVideoEffectByName("test");
  }
};

export const helloWorld = () => {
  alert("Hello from Premiere Pro.");
};

/**
 * Downloads a file using ExtendScript's Socket class
 * @param url URL of the file to download
 * @param targetFile File object where to save the download
 * @return Boolean indicating success or failure
 */
export const downloadFile = (url: string, targetFile: File): boolean => {
  try {
    // Use Socket object for HTTP communication
    alert("Downloading file...");
    const connection = new Socket();

    // Extract domain and path from URL
    let domain = url.replace(/^https?:\/\//, "");
    let path = "/";

    const slashIndex = domain.indexOf("/");
    if (slashIndex !== -1) {
      path = domain.substring(slashIndex);
      domain = domain.substring(0, slashIndex);
    }

    // Connect to the server
    if (!connection.open(domain + ":80", "binary")) {
      alert("Cannot connect to " + domain);
      return false;
    }

    // Send HTTP GET request
    const request =
      "GET " +
      path +
      " HTTP/1.0\r\n" +
      "Host: " +
      domain +
      "\r\n" +
      "User-Agent: ExtendScript\r\n" +
      "Connection: close\r\n\r\n";

    connection.write(request);

    // Read the response
    let response = "";
    let chunk;
    while (!connection.eof) {
      chunk = connection.read(1024);
      if (chunk) response += chunk;
    }
    connection.close();

    // Parse response headers and body
    const headerEndIndex = response.indexOf("\r\n\r\n");
    if (headerEndIndex === -1) {
      alert("Invalid HTTP response");
      return false;
    }

    const headerText = response.substring(0, headerEndIndex);
    const body = response.substring(headerEndIndex + 4);

    // Check if response is successful
    if (headerText.indexOf("200 OK") === -1) {
      alert("HTTP Error: " + headerText.split("\r\n")[0]);
      return false;
    }

    // Write the file content
    targetFile.encoding = "binary";
    targetFile.open("w");
    targetFile.write(body);
    targetFile.close();

    return true;
  } catch (error) {
    const errorMessage =
      typeof error === "object" && error !== null
        ? String(error)
        : "Unknown error";
    alert("Download error: " + errorMessage);
    return false;
  }
};

/**
 * Downloads a file from a URL and imports it to the Premiere Pro timeline
 * @param url URL of the file to download
 * @param filename Filename to save as
 * @return Object with status and path if successful
 */
export const downloadAndImportToTimeline = (
  url: string,
  filename: string
): { status: string; path?: string; message: string } => {
  try {
    // Create a temporary folder if it doesn't exist
    alert("Creating temp folder");
    const tempFolder = Folder.temp.toString() + "/TessactDownloads";
    const tempFolderObj = new Folder(tempFolder);
    if (!tempFolderObj.exists) {
      tempFolderObj.create();
    }

    alert("Temp folder created");
    // Define the local file path
    const localFilePath = tempFolder + "/" + filename;
    const localFile = new File(localFilePath);

    // Download the file using our downloadFile function
    const success = downloadFile(url, localFile);

    if (!success) {
      return { status: "error", message: "Failed to download file" };
    }

    // Make sure we have an active project
    if (!app.project) {
      return { status: "error", message: "No active project" };
    }

    try {
      // Get the root item in the project for importing
      const rootItem = app.project.rootItem;

      // Import the file
      app.project.importFiles([localFile.fsName], false, rootItem, false);

      // Locate the imported item - typically the most recently added item
      let importedItem = null;
      for (let i = 0; i < rootItem.children.numItems; i++) {
        const item = rootItem.children[i];
        if (item.name === filename || item.name === localFile.name) {
          importedItem = item;
          break;
        }
      }

      if (!importedItem) {
        return {
          status: "error",
          message: "Imported file could not be located in project",
        };
      }

      // Get the active sequence or create one if needed
      let activeSequence = app.project.activeSequence;

      if (!activeSequence) {
        // Create a new sequence
        const newSequence = app.project.createNewSequence("New Sequence", "");
        activeSequence = app.project.activeSequence;

        if (!activeSequence) {
          return { status: "error", message: "Could not create sequence" };
        }
      }

      // Add to timeline
      if (activeSequence.videoTracks.numTracks > 0) {
        const videoTrack = activeSequence.videoTracks[0];
        videoTrack.overwriteClip(importedItem, 0);
      } else {
        return {
          status: "error",
          message: "No video tracks available in sequence",
        };
      }

      return {
        status: "success",
        path: localFilePath,
        message: "File imported and added to timeline",
      };
    } catch (error) {
      return {
        status: "error",
        message:
          "Error during import or timeline insertion: " +
          (typeof error === "object" && error !== null
            ? String(error)
            : "Unknown error"),
      };
    }
  } catch (error) {
    const errorMessage =
      typeof error === "object" && error !== null
        ? String(error)
        : "Unknown error";
    return {
      status: "error",
      message: errorMessage,
    };
  }
};
