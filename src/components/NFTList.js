import React, { useEffect, useState } from "react";
import Web3 from "web3";
import NFTMarketplace from "../contracts/NFTMarketplace.json";
import "../style.css";

const NFTList = () => {
  const [nfts, setNFTs] = useState([]);
  const [web3, setWeb3] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initializeWeb3();
  }, []);

  useEffect(() => {
    if (web3 && initialized) {
      loadNFTs();
    }
  }, [web3, initialized]);

  const initializeWeb3 = () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      setInitialized(true);
    }
  };

  const formatAddress = (address) => {
    if (address.length > 10) {
      const shortenedAddress = address.slice(0, 6);
      const ellipsis = "...";
      const endingAddress = address.slice(-4);
      return `${shortenedAddress}${ellipsis}${endingAddress}`;
    }
    return address;
  };

  const loadNFTs = async () => {
    try {
      // Get the user's current Ethereum address
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];

      // Load the NFTMarketplace contract
      const networkId = await web3.eth.net.getId();
      const marketplaceData = NFTMarketplace.networks[networkId];
      if (!marketplaceData) {
        throw new Error("NFTMarketplace contract not deployed on the current network");
      }
      const marketplace = new web3.eth.Contract(NFTMarketplace.abi, marketplaceData.address);

      // Call the getAllNFTs function in the smart contract
      const nfts = await marketplace.methods.getAllNFTs().call({ from: address });
      setNFTs(nfts);
      
    } catch (error) {
      console.log("Error loading NFTs:", error);
    }
  };

  return (
    <>
    <div className="nft-list">
    <h1>NFTs for Sale</h1>
    </div>
    <div className="nft-list">
      {nfts.map((nft, index) => (
        <div className="nft-item" key={index}>
          <h2>NFT {index + 1}</h2>
          <p>Token ID: {nft.tokenId}</p>
          <p>Seller: {formatAddress(nft.seller)}</p>
          <p>Owner: {formatAddress(nft.owner)}</p>
          <p>Price: {web3 && web3.utils.fromWei(nft.price, "ether")} ETH</p>
          <img src="https://gateway.pinata.cloud/ipfs/QmdEdRdLd9gpTXXyCpK8Ky7hgXHwDdedQnXZnZNsShLvz5" alt={`NFT ${index + 1}`} />
          {/* <img src={nft.image} alt={`NFT ${index + 1}`} /> */}
          
        </div>
      ))}
    </div>
    
    </>
  );
};

export default NFTList;
