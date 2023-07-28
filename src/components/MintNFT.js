import React, { useState } from "react";
import Web3 from "web3";
import Marketplace from "../contracts/NFTMarketplace.json";
import "../style.css";

const MintNFT = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [metadataURL, setMetadataURL] = useState("");

  const handleMintNFT = async () => {
    try {
      if (!name || !price || !metadataURL) {
        throw new Error("Please provide name, price, and metadata URL");
      }

      const convertedPrice = Web3.utils.toWei(price, "ether");

      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();

        const contract = new web3.eth.Contract(
          Marketplace.abi,
          Marketplace.networks[5777].address // Replace <NETWORK_ID> with the desired network ID
        );

        const listingPrice = await contract.methods.getListPrice().call();

        await contract.methods
          .createToken(metadataURL, convertedPrice)
          .send({ from: accounts[0], value: listingPrice });

        alert("Successfully listed your NFT!");
      } else {
        alert("Please install MetaMask to mint NFTs.");
      }
    } catch (error) {
      alert("Upload error: " + error.message);
    }
  };

  return (
    <div className="mint-nft-container">
      <div className="input-container">
        <label htmlFor="name" className="label">
          Name:
        </label>
        <input
          type="text"
          id="name"
          className="input"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div className="input-container">
        <label htmlFor="price" className="label">
          Price:
        </label>
        <input
          type="number"
          id="price"
          className="input"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        />
      </div>
      <div className="input-container">
        <label htmlFor="metadataURL" className="label">
          Metadata URL:
        </label>
        <input
          type="text"
          id="metadataURL"
          className="input"
          value={metadataURL}
          onChange={(event) => setMetadataURL(event.target.value)}
        />
      </div>
      <button type="button" onClick={handleMintNFT} className="mint-button">
        Mint NFT
      </button>
    </div>
  );
};

export default MintNFT;























// import React, { useState } from "react";
// import { create, globSource } from "ipfs-http-client";

// const MintNFT = () => {
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState(0);
//   const [file, setFile] = useState(null);

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     setFile(selectedFile);
//   };

//   const handleMintNFT = async () => {
//     if (!name || price <= 0 || !file) {
//       console.error("Please provide name, price, and select a file");
//       return;
//     }

//     // Upload the file to IPFS
//     const ipfs = create({ host: "ipfs.infura.io", port: 5001, protocol: "https" });
//     const fileData = globSource(file);
//     const uploadResult = await ipfs.addAll(fileData);

//     // Get the IPFS URL of the uploaded file
//     const ipfsUrl = `https://ipfs.io/ipfs/${uploadResult.path}`;
//     console.log(ipfsUrl);

//     // Call the smart contract function to mint the NFT
//     // Pass the 'name', 'price', and 'ipfsUrl' to the smart contract function
//     // Add your smart contract minting logic here

//     // Reset the form fields
//     setName("");
//     setPrice(0);
//     setFile(null);
//   };

//   return (
//     <div>
//       <h2>Mint NFT</h2>
//       <form>
//         <div>
//           <label htmlFor="name">Name:</label>
//           <input
//             type="text"
//             id="name"
//             value={name}
//             onChange={(event) => setName(event.target.value)}
//           />
//         </div>
//         <div>
//           <label htmlFor="price">Price:</label>
//           <input
//             type="number"
//             id="price"
//             value={price}
//             onChange={(event) => setPrice(parseFloat(event.target.value))}
//           />
//         </div>
//         <div>
//           <label htmlFor="file">File:</label>
//           <input type="file" id="file" onChange={handleFileChange} />
//         </div>
//         <button type="button" onClick={handleMintNFT}>
//           Mint NFT
//         </button>
//       </form>
//     </div>
//   );
// };

// export default MintNFT;












// import React, { useState } from 'react';
// import { create } from 'ipfs-http-client';

// const ipfs = create({
//   host: 'ipfs.infura.io',
//   port: 5001,
//   protocol: 'https',
//   headers: {
//     authorization: 'e039fa36a4a2461282c69d8cf8099d6a'
//   }
// });

// const NFTUploadComponent = () => {
//   const [nftName, setNFTName] = useState('');
//   const [price, setPrice] = useState('');
//   const [imageFile, setImageFile] = useState(null);
//   const [ipfsURI, setIpfsURI] = useState('');

//   const handleNameChange = (e) => {
//     setNFTName(e.target.value);
//   };

//   const handlePriceChange = (e) => {
//     setPrice(e.target.value);
//   };

//   const handleFileChange = (e) => {
//     setImageFile(e.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!nftName || !price || !imageFile) {
//       alert('Please fill in all fields');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onloadend = async () => {
//       const buffer = new Blob([reader.result]);

//       try {
//         const result = await ipfs.add(buffer);
//         const uploadedURI = `https://ipfs.io/ipfs/${result.path}`;
//         setIpfsURI(uploadedURI);
//       } catch (error) {
//         console.error('Error uploading to IPFS:', error);
//       }
//     };
//     reader.readAsArrayBuffer(imageFile);
//   };

//   return (
//     <div>
//       <h1>Upload NFT to IPFS</h1>
//       <div>
//         <label>NFT Name:</label>
//         <input type="text" value={nftName} onChange={handleNameChange} />
//       </div>
//       <div>
//         <label>Price:</label>
//         <input type="text" value={price} onChange={handlePriceChange} />
//       </div>
//       <div>
//         <label>Image File:</label>
//         <input type="file" accept="image/*" onChange={handleFileChange} />
//       </div>
//       <button onClick={handleUpload}>Upload</button>
//       {ipfsURI && (
//         <div>
//           <h2>Uploaded Data</h2>
//           <p>NFT Name: {nftName}</p>
//           <p>Price: {price}</p>
//           <img src={ipfsURI} alt="Uploaded NFT" />
//           <p>IPFS URI: {ipfsURI}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NFTUploadComponent;





























