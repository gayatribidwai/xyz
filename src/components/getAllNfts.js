import React, { useEffect, useState } from "react";
import Web3 from "web3";
import NFTMarketplace from "../contracts/NFTMarketplace.json";

const NFTList = () => {
  const [nfts, setNFTs] = useState([]);

  useEffect(() => {
    loadNFTs();
  }, []);

  const loadNFTs = async () => {
    try {
      // Initialize Web3
      const web3 = new Web3(window.ethereum);
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
    <div>
      <h1>NFTs for Sale</h1>
      {nfts.map((nft, index) => (
        <div key={index}>
          <h2>NFT {index + 1}</h2>
          <p>Token ID: {nft.tokenId}</p>
          <p>Seller: {nft.seller}</p>
          <p>Owner: {nft.owner}</p>
          <p>Price: {web3.utils.fromWei(nft.price, "ether")} ETH</p>
          <img src={nft.image} alt={`NFT ${index + 1}`} />
        </div>
      ))}
    </div>
  );
};

export default NFTList;
