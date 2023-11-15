import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getSpot, updateSpot } from "../../../store/spots";
import "./UpdateSpot.css";

const UpdateSpot = () => {
  const history = useHistory();
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    setErrors({});

    if (!country)
      setErrors((errors) => ({ ...errors, country: "Country is required" }));

    if (!address)
      setErrors((errors) => ({ ...errors, address: "Address is required" }));

    if (!city) setErrors((errors) => ({ ...errors, city: "City is required" }));

    if (!state)
      setErrors((errors) => ({ ...errors, state: "State is required" }));

    if (!lat)
      setErrors((errors) => ({ ...errors, lat: "Latitude is required" }));

    if (!lng)
      setErrors((errors) => ({ ...errors, lng: "Longitude is required" }));

    if (!description || description.length < 30)
      setErrors((errors) => ({
        ...errors,
        description: "Description needs a minium of 30 characters",
      }));

    if (!name) setErrors((errors) => ({ ...errors, name: "Name is required" }));

    if (!price)
      setErrors((errors) => ({ ...errors, price: "Price is required" }));

    if (!previewImage)
      setErrors((errors) => ({
        ...errors,
        previewImage: "PreviewImage is required",
      }));
    else if (
      !previewImage.endsWith(".png") &&
      !previewImage.endsWith(".jpg") &&
      !previewImage.endsWith(".jpeg")
    )
      setErrors((errors) => ({
        ...errors,
        previewImage: "Image URL must end in .png, .jpg, or .jpeg",
      }));

    if (
      image1 &&
      !image1.endsWith(".png") &&
      !image1.endsWith(".jpg") &&
      !image1.endsWith(".jpeg")
    )
      setErrors((errors) => ({
        ...errors,
        image1: "Image URL must end in .png, .jpg, or .jpeg",
      }));

    if (
      image2 &&
      !image2.endsWith(".png") &&
      !image2.endsWith(".jpg") &&
      !image2.endsWith(".jpeg")
    )
      setErrors((errors) => ({
        ...errors,
        image2: "Image URL must end in .png, .jpg, or .jpeg",
      }));

    if (
      image3 &&
      !image3.endsWith(".png") &&
      !image3.endsWith(".jpg") &&
      !image3.endsWith(".jpeg")
    )
      setErrors((errors) => ({
        ...errors,
        image3: "Image URL must end in .png, .jpg, or .jpeg",
      }));

    if (
      image4 &&
      !image4.endsWith(".png") &&
      !image4.endsWith(".jpg") &&
      !image4.endsWith(".jpeg")
    )
      setErrors((errors) => ({
        ...errors,
        image3: "Image URL must end in .png, .jpg, or .jpeg",
      }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validate();

    if (Object.keys(errors).length === 0) {
      await dispatch(
        updateSpot(spotId, {
          country,
          address,
          city,
          state,
          lat,
          lng,
          name,
          description,
          price,
        })
      )
        .then(() => {
          history.push(`/spots/${spotId}`);
        })
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors((errors) => ({ ...errors, ...data.errors }));
          }
        });
    }
  };

  useEffect(() => {
    dispatch(getSpot(spotId)).then((spot) => {
      setCountry(spot.country);
      setAddress(spot.address);
      setCity(spot.city);
      setState(spot.state);
      setLat(spot.lat);
      setLng(spot.lng);
      setName(spot.name);
      setDescription(spot.description);
      setPrice(spot.price);
      spot.SpotImages.forEach((img) => {
        if (img.preview) {
          setPreviewImage(img.url);
        } else {
          if (!image1) setImage1(img.url);
          if (!image2) setImage2(img.url);
          if (!image3) setImage3(img.url);
          if (!image4) setImage4(img.url);
        }
      });

      setIsLoading(false);
    });
  }, [dispatch, spotId]);

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <form className="create-spot-form" onSubmit={handleSubmit}>
      <h2>Update your Spot</h2>

      <div>
        <h3 className="section-h3">Where's your place located?</h3>
        <p className="section-p">
          Guests will only get your exact address once they booked a
          reservation.
        </p>
      </div>

      <div className="input-row">
        <label htmlFor="country">
          Country <span className="error">{errors.country}</span>
        </label>
        <input
          className="input-wide"
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country"
          id="country"
        ></input>
      </div>

      <div className="input-row">
        <label htmlFor="street-address">
          Street Address <span className="error">{errors.address}</span>
        </label>
        <input
          className="input-wide"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          id="street-address"
        />
      </div>

      <div className="input-row-two-col">
        <div className="small-input-div" style={{ width: "300px" }}>
          <label htmlFor="city">
            City <span className="error">{errors.city}</span>
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            id="city"
          />
        </div>
        <div>&nbsp;,&nbsp;</div>
        <div className="small-input-div">
          <label htmlFor="state">
            State <span className="error">{errors.state}</span>
          </label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="STATE"
            id="state"
          />
        </div>
      </div>

      <div className="input-row-two-col">
        <div className="small-input-div" style={{ width: "220px" }}>
          <label htmlFor="latitude">
            Latitude <span className="error">{errors.lat}</span>
          </label>
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="Latitude"
            id="latitude"
          />
        </div>
        <div>&nbsp;,&nbsp;</div>
        <div className="small-input-div" style={{ width: "220px" }}>
          <label htmlFor="longitude">
            Longitude <span className="error">{errors.lng}</span>
          </label>
          <input
            type="text"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="Longitude"
            id="longitude"
          />
        </div>
      </div>

      <div className="inner-section-div">
        <h3 className="section-h3">Describe your place to guests</h3>
        <p className="section-p">
          Mention the best features of your space, any special amenities like
          fast wif or parking, and what you love about the neighborhood.
        </p>
      </div>
      <div>
        <textarea
          className="input-wide"
          rows="10"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Please write at least 30 characters"
          id="place-description"
        />
        {errors.description && <p className="error">{errors.description}</p>}
      </div>

      <div className="inner-section-div">
        <h3 className="section-h3">Create a title for your spot</h3>
        <p className="section-p">
          Catch guests' attention with a spot title that highlights what makes
          your place special.
        </p>
      </div>
      <div>
        <input
          className="input-wide"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name of your spot"
          id="spot-name"
        />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>

      <div className="inner-section-div">
        <h3 className="section-h3">Set a base price for your spot</h3>
        <p className="section-p">
          Competitive pricing can help your listing stand out and rank higher in
          search results.
        </p>
      </div>
      <div>
        <label htmlFor="price">$ </label>
        <input
          style={{ width: "90%" }}
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price per night (USD)"
          id="price"
        />
        {errors.price && <p className="error">{errors.price}</p>}
      </div>

      <div className="inner-section-div">
        <h3 className="section-h3">Liven up your spot with photos</h3>
        <p className="section-p">
          Submit a link to at least one photo to publish your spot
        </p>
      </div>
      <div>
        <div className="input-image-div">
          <input
            className="input-wide"
            type="text"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            placeholder="Preview Image URL"
            id="previewImage"
          />
          {errors.previewImage && (
            <p className="error">{errors.previewImage}</p>
          )}
        </div>

        <div className="input-image-div">
          <input
            className="input-wide"
            type="text"
            value={image1}
            onChange={(e) => setImage1(e.target.value)}
            placeholder="Image URL"
            id="image1"
          />
          {errors.image1 && <p className="error">{errors.image1}</p>}
        </div>

        <div className="input-image-div">
          <input
            className="input-wide"
            type="text"
            value={image2}
            onChange={(e) => setImage2(e.target.value)}
            placeholder="Image URL"
            id="image2"
          />
          {errors.image2 && <p className="error">{errors.image2}</p>}
        </div>

        <div className="input-image-div">
          <input
            className="input-wide"
            type="text"
            value={image3}
            onChange={(e) => setImage3(e.target.value)}
            placeholder="Image URL"
            id="image3"
          />
          {errors.image3 && <p className="error">{errors.image3}</p>}
        </div>

        <div className="input-image-div">
          <input
            className="input-wide"
            type="text"
            value={image4}
            onChange={(e) => setImage4(e.target.value)}
            placeholder="Image URL"
            id="image4"
          />
          {errors.image4 && <p className="error">{errors.image4}</p>}
        </div>
      </div>

      <div className="submit-button-div">
        <button className="submit-button" type="submit">
          Update your Spot
        </button>
      </div>
    </form>
  );
};

export default UpdateSpot;
