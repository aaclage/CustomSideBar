  /**
   * Add File to Array Files of type File[] 123
   * https://www.meziantou.net/upload-files-and-directories-using-an-input-drag-and-drop-or-copy-and-paste-with.htm 
   * @param dataTransfer 
   */
  private getFilesAsync = async (e) => {
    const Customfiles = e.dataTransfer;
    const items = Customfiles.items;
    const Directory = [];
    const files: File[] = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === "file") {
            if (typeof item.webkitGetAsEntry === "function") {
                const entry = item.webkitGetAsEntry();
                if (entry.isDirectory) {
                    Directory.push(entry);
                } else {
                    const file = item.getAsFile();
                    if (file) {
                        file.fullPath = "";
                        files.push(file);
                    }
                }
                continue;
            }
        }
    }
    if (Directory.length > 0) {
        const entryContent = await this.readEntryContentAsync(Directory);
        files.push(...entryContent);
    }
    return files;
}

  // Returns a promise with all the files of the directory hierarchy
  /**
   * 
   * @param entry 
   */
  private readEntryContentAsync = (Directory) => {
    return new Promise<File[]>((resolve, reject) => {
        let reading = 0;
        const contents: File[] = [];
        Directory.forEach(entry => {
            readEntry(entry, "");
        });

        function readEntry(entry, path) {
            if (entry.isDirectory) {
                readReaderContent(entry.createReader());
            } else {
                reading++;
                entry.file(file => {
                    reading--;
                    file.fullPath = path;
                    contents.push(file);

                    if (reading === 0) {
                        resolve(contents);
                    }
                });
            }
        }

        function readReaderContent(reader) {
            reading++;

            reader.readEntries((entries) => {
                reading--;
                for (const entry of entries) {
                    readEntry(entry, entry.fullPath);
                }

                if (reading === 0) {
                    resolve(contents);
                }
            });
        }
    });
}