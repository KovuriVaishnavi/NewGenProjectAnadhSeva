import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./styles/VolunteerDashboard.css";

export default function VolunteerActiveRequests() {
  const [showImage, setShowImage] = useState(false);
  const [imageSrc, setImageSrc] = useState(null); // Track the current image source
  const [transactions, setTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [location, setLocation] = useState({
    lat: 0,
    long: 0,
  });

  useEffect(() => {
    getTransactions();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      });
    }
  }, []);

  const getTransactions = async () => {
    try {
      const response = await axios.get("http://localhost:9004/api/volunteer", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      setTransactions(response.data.transactions);
      setAllTransactions(response.data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  const filterTransactions = (maxDistance) => {
    const filteredTransactions = allTransactions.filter((transaction) => {
      const d1 = haversineDistance(
        location.lat,
        location.long,
        transaction.dloc.lat,
        transaction.dloc.long
      );
      const d2 = haversineDistance(
        location.lat,
        location.long,
        transaction.rloc.lat,
        transaction.rloc.long
      );
      return d1 <= maxDistance || d2 <= maxDistance;
    });
    setTransactions(filteredTransactions);
  };

  const fivekmrange = () => {
    filterTransactions(5);
  };

  const tenkmrange = () => {
    filterTransactions(10);
  };

  const cityrange = () => {
    filterTransactions(15);
  };

  const others = () => {
    setTransactions(allTransactions);
  };

  const acceptTransaction = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:9004/api/volunteer/${id}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (response.status === 200) {
        setTransactions((prevTransactions) =>
          prevTransactions.filter((transaction) => transaction._id !== id)
        );

        toast.success("Request accepted successfully");
      } else {
        toast.error("Could not take request");
      }
    } catch (error) {
      console.error("Error accepting transaction:", error);
      toast.error("Could not take request");
    }
  };

  return (
    <div className="volunteer">
      <div
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        className="instant-donate"
      >
        <div className="filter">
          <button className="filter-button green-button" onClick={fivekmrange}>
            5 Km
          </button>
          <button className="filter-button green-button" onClick={tenkmrange}>
            10 Km
          </button>
          <button className="filter-button green-button" onClick={cityrange}>
            City
          </button>
          <button className="filter-button green-button" onClick={others}>
            All
          </button>
        </div>
      </div>
      <div className="flex-box">
        <div className="transactions">
          <h2>Transactions</h2>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div key={transaction._id} className="transaction">
                <div className="donar-details">
                  <h3>From</h3>
                  <p className="donorname">{transaction.donarName}</p>
                  <p className="receivername">
                    Address: {transaction.dloc.name}
                  </p>
                </div>
                <button
                  className="accept-button"
                  onClick={() => acceptTransaction(transaction._id)}
                >
                  Accept
                </button>
                <div className="receiver-details">
                  <h3>To</h3>
                  <p className="receivername">{transaction.receiverName}</p>
                  <p className="receivername">
                    Address: {transaction.rloc.name}
                  </p>
                </div>
                <div
                  className="image-btn"
                  onClick={() => {
                    setImageSrc(
                      `http://localhost:9004${transaction.pictureUrl}`
                    );
                    setShowImage(true);
                  }}
                >
                  <i className="fa-solid fa-camera"></i>
                </div>
                {showImage && imageSrc && (
                  <div>
                    <div
                      className="overlay"
                      onClick={() => {
                        setShowImage(false);
                        setImageSrc(null);
                      }}
                    >
                      <div className="cross-image">
                        <i className="fa-solid fa-x"></i>
                      </div>
                    </div>
                    <div className="image-food">
                      <img src={imageSrc} alt="Donation" />
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No transactions available</p>
          )}
        </div>
      </div>
    </div>
  );
}
