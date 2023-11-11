import { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { addImageToSpot, createSpot } from "../../store/spots";

const CreateSpot = () => {
  const dispatch = useDispatch();
  const history = useHistory();
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

    console.log("errors", errors);

    if (Object.keys(errors).length === 0) {
      console.log("create spot");
      const newSpot = await dispatch(
        createSpot({
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
      ).catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors((errors) => ({ ...errors, ...data.errors }));
        }
      });

      if (newSpot && newSpot.id) {
        dispatch(
          addImageToSpot(newSpot.id, { url: previewImage, preview: true })
        );
        if (image1) {
          dispatch(addImageToSpot(newSpot.id, { url: image1, preview: false }));
        }
        if (image2) {
          dispatch(addImageToSpot(newSpot.id, { url: image2, preview: false }));
        }
        if (image3) {
          dispatch(addImageToSpot(newSpot.id, { url: image3, preview: false }));
        }
        if (image4) {
          dispatch(addImageToSpot(newSpot.id, { url: image4, preview: false }));
        }

        history.push(`/spots/${newSpot.id}`);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Create a new Spot</h2>
        <div>
          <h3>Where's your place located?</h3>
          <p>
            Guests will only get your exact address once they booked a
            reservation.
          </p>
        </div>
        <div>
          <label htmlFor="country">Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country"
            id="country"
          ></input>
          {errors.country && <p className="error">{errors.country}</p>}
        </div>
        <div>
          <label htmlFor="street-address">Street Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            id="street-address"
          />
          {errors.address && <p className="error">{errors.address}</p>}
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            id="city"
          />
          {errors.city && <p className="error">{errors.city}</p>}
        </div>
        <div>
          <label htmlFor="state">State</label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            placeholder="STATE"
            id="state"
          />
          {errors.state && <p className="error">{errors.state}</p>}
        </div>
        <div>
          <label htmlFor="latitude">Latitude</label>
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="Latitude"
            id="latitude"
          />
          {errors.lat && <p className="error">{errors.lat}</p>}
        </div>
        <div>
          <label htmlFor="longitude">Longitude</label>
          <input
            type="text"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="Longitude"
            id="longitude"
          />
          {errors.lng && <p className="error">{errors.lng}</p>}
        </div>
        <div>
          <h3>Describe your place to guests</h3>
          <p>
            Mention the best features of your space, any special amentities like
            fast wif or parking, and what you love about the neighborhood.
          </p>
        </div>
        <div>
          <label htmlFor="place-description"></label>
          <input
            type="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please write at least 30 characters"
            id="place-description"
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>
        <div>
          <h3>Create a title for your spot</h3>
          <p>
            Catch guests' attention with a spot title that highlights what makes
            your place special.
          </p>
        </div>
        <div>
          <label htmlFor="spot-name"></label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name of your spot"
            id="spot-name"
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div>
          <h3>Set a base price for your spot</h3>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
        </div>
        <div>
          <label htmlFor="price">$ </label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price per night (USD)"
            id="price"
          />
          {errors.price && <p className="error">{errors.price}</p>}
        </div>
        <div>
          <h3>Liven up your spot with photos</h3>
          <p>Submit a link to at least one photo to publish your spot</p>
        </div>
        <div>
          <label htmlFor="previewImage"></label>
          <input
            type="text"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            placeholder="Preview Image URL"
            id="previewImage"
          />
          {errors.previewImage && (
            <p className="error">{errors.previewImage}</p>
          )}
          <br></br>
          <br></br>

          <label htmlFor="image1"></label>
          <input
            type="text"
            value={image1}
            onChange={(e) => setImage1(e.target.value)}
            placeholder="Image URL"
            id="image1"
          />
          {errors.image1 && <p className="error">{errors.image1}</p>}
          <br></br>
          <br></br>
          <label htmlFor="image2"></label>
          <input
            type="text"
            value={image2}
            onChange={(e) => setImage2(e.target.value)}
            placeholder="Image URL"
            id="image2"
          />
          {errors.image2 && <p className="error">{errors.image2}</p>}
          <br></br>
          <br></br>
          <label htmlFor="image3"></label>
          <input
            type="text"
            value={image3}
            onChange={(e) => setImage3(e.target.value)}
            placeholder="Image URL"
            id="image3"
          />
          {errors.image3 && <p className="error">{errors.image3}</p>}
          <br></br>
          <br></br>
          <label htmlFor="image4"></label>
          <input
            type="text"
            value={image4}
            onChange={(e) => setImage4(e.target.value)}
            placeholder="Image URL"
            id="image4"
          />
          {errors.image4 && <p className="error">{errors.image4}</p>}
          <br></br>
          <br></br>
        </div>
        <br></br>
        <div>
          <button type="submit">Create a Spot</button>
        </div>
      </form>
    </>
  );
};

export default CreateSpot;
