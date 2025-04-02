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
 * Creates a test file (temporary solution until we implement proper downloading)
 * @param url URL of the file to download (ignored in this implementation)
 * @param targetFile File object where to save the download
 * @return Boolean indicating success or failure
 */
export const downloadFile = (url: string, targetFile: File): boolean => {
  try {
    // For testing purposes, we'll just create a simple file
    alert("Creating test file at: " + targetFile.fsName);

    // Create the parent directory if it doesn't exist
    const parentFolder = new Folder(targetFile.parent.fsName);
    if (!parentFolder.exists) {
      parentFolder.create();
    }

    // Create a simple file
    targetFile.open("w");
    targetFile.write("This is a test file to simulate a downloaded video.");
    targetFile.close();

    alert("Test file created successfully");
    return true;
  } catch (error) {
    const errorMessage =
      typeof error === "object" && error !== null
        ? String(error)
        : "Unknown error";
    alert("Error creating test file: " + errorMessage);
    return false;
  }
};

/**
 * Downloads a file from a URL and imports it to the Premiere Pro timeline
 * @param url URL of the file to download
 * @param filename Filename to save as
 * @return Object with status and path if successful
 */
export const downloadAndImportToTimeline = (url: string, filename: string) => {
  try {
    // Log inputs for debugging
    $.writeln("Starting import from URL: " + url);
    $.writeln("Using filename: " + filename);

    // Create a temporary folder if it doesn't exist
    const tempFolder = Folder.temp.toString() + "/TessactDownloads";
    const tempFolderObj = new Folder(tempFolder);
    if (!tempFolderObj.exists) {
      tempFolderObj.create();
    }

    // Define the local file path
    const localFilePath = tempFolder + "/" + filename;
    const localFile = new File(localFilePath);

    $.writeln("Downloading to: " + localFilePath);

    // Download the file using our downloadFile function
    const success = downloadFile(url, localFile);

    if (!success) {
      $.writeln("Download failed");
      return { status: "error", message: "Failed to download file" };
    }

    $.writeln("Download successful");

    // Make sure we have an active project
    if (!app.project) {
      $.writeln("No active project");
      return { status: "error", message: "No active project" };
    }

    try {
      // Get the root item in the project for importing
      const rootItem = app.project.rootItem;

      $.writeln("Importing file: " + localFile.fsName);

      // Import the file
      app.project.importFiles([localFile.fsName], false, rootItem, false);

      $.writeln("File imported, searching for item in project");

      // Locate the imported item - typically the most recently added item
      let importedItem = null;
      for (let i = 0; i < rootItem.children.numItems; i++) {
        const item = rootItem.children[i];
        $.writeln("Checking item: " + item.name);
        if (item.name === filename || item.name === localFile.name) {
          importedItem = item;
          break;
        }
      }

      if (!importedItem) {
        $.writeln("Imported item not found in project");
        return {
          status: "error",
          message: "Imported file could not be located in project",
        };
      }

      $.writeln("Found imported item: " + importedItem.name);

      // Get the active sequence or create one if needed
      let activeSequence = app.project.activeSequence;

      if (!activeSequence) {
        $.writeln("No active sequence, creating new one");
        // Create a new sequence
        const newSequence = app.project.createNewSequence("New Sequence", "");
        activeSequence = app.project.activeSequence;

        if (!activeSequence) {
          $.writeln("Failed to create sequence");
          return { status: "error", message: "Could not create sequence" };
        }
      }

      $.writeln("Working with sequence: " + activeSequence.name);

      // Add to timeline
      if (activeSequence.videoTracks.numTracks > 0) {
        $.writeln("Adding clip to video track 0");
        const videoTrack = activeSequence.videoTracks[0];
        videoTrack.overwriteClip(importedItem, 0);
        $.writeln("Clip added to timeline");
      } else {
        $.writeln("No video tracks in sequence");
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
    } catch (importError) {
      const errorMsg =
        typeof importError === "object" && importError !== null
          ? String(importError)
          : "Unknown import error";
      $.writeln("Import error: " + errorMsg);
      return {
        status: "error",
        message: "Error during import or timeline insertion: " + errorMsg,
      };
    }
  } catch (error) {
    const errorMessage =
      typeof error === "object" && error !== null
        ? String(error)
        : "Unknown error";
    $.writeln("Function error: " + errorMessage);
    return {
      status: "error",
      message: errorMessage,
    };
  }
};
