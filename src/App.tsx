import React from "react";

import { storage } from "./firebase";

const App = () => {
  const [imgNames, setImgNames] = React.useState<string[]>([]);
  const [imgUrls, setImgUrls] = React.useState<string[]>([]);

  const [progressValue, setProgressValue] = React.useState<number>(0);
  const folderName = React.useRef("photos").current;

  const getImageNames = async () => {
    const photosRef = storage.ref().child(folderName);
    try {
      const photos: any = await photosRef.listAll();
      let imgNameList: string[] = [];
      photos.items.forEach((item: any) => {
        const imgName: string = item._delegate._location.path_;
        imgNameList.push(imgName);
      });
      setImgNames(imgNameList);
      getImageUrls(imgNameList);
    } catch (error) {
      console.log(error);
    }
  };

  const getImageUrls = async (imgNames: string[]) => {
    const imgUrlList: string[] = [];
    for (let i = 0; i < imgNames.length; i++) {
      const imgUrl = await storage.ref().child(imgNames[i]).getDownloadURL();
      imgUrlList.push(imgUrl);
    }
    setImgUrls(imgUrlList);
  };

  React.useEffect(() => {
    getImageNames();
    // eslint-disable-next-line
  }, []);

  function render() {
    if (imgUrls.length > 0) {
      return imgUrls.map((item, index) => (
        <img
          style={{ width: 200, height: 200, objectFit: "cover" }}
          key={index}
          src={item}
          alt={imgNames[index]}
        />
      ));
    }
  }

  function handleChange(e: any) {
    const file = e.target.files[0];
    console.log(file);

    //* Create storage ref
    const storageRef = storage.ref(`photos/${file.name}`);
    console.log(storageRef);

    //* Upload file
    const task = storageRef.put(file);
    console.log(task);

    //* Update progress bar
    task.on(
      "stage_changed",
      function progress(snapshot) {
        const percentage =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgressValue(percentage);
        console.log("upload done");
      },
      function error(err) {
        console.log(err);
      },
      function complete() {
        task.snapshot.ref.getDownloadURL().then((url) => {
          console.log(url);
        });
      }
    );
  }

  return (
    <div>
      {render()}
      <progress value={progressValue} max="100" id="uploader"></progress>
      <input type="file" onChange={handleChange} />
      <select>
        {imgNames.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
      <input type="button" value="delete" />
    </div>
  );
};

export default App;
