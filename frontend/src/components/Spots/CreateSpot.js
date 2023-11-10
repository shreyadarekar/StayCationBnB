const CreateSpot = () => {
  return (
    <>
      <form>
        <h2>Create a new Spot</h2>
        <div>
          <h3>Where's your place located?</h3>
          <p>
            Guests will only get your exact address once they booked a
            reservation.
          </p>
        </div>
        <div>
          <label for="country">Country</label>
          <input type="text" placeholder="Country" id="country"></input>
        </div>
        <div>
          <label for="street-address">Street Address</label>
          <input type="text" placeholder="Address" id="street-address" />
        </div>
        <div>
          <label for="city">City</label>
          <input type="text" placeholder="City" id="city" />
        </div>
        <div>
          <label for="state">State</label>
          <input type="text" placeholder="STATE" id="state" />
        </div>
        <div>
          <label for="latitude">Latitude</label>
          <input type="text" placeholder="Latitude" id="state" />
        </div>
        <div>
          <label for="longitude">Longitude</label>
          <input type="text" placeholder="Longitude" id="longitude" />
        </div>
        <div>
          <h3>Describe your place to guests</h3>
          <p>
            Mention the best features of your space, any special amentities like
            fast wif or parking, and what you love about the neighborhood.
          </p>
        </div>
        <div>
          <label for="place-description"></label>
          <input
            type="textarea"
            placeholder="Please write at least 30 characters"
            id="place-description"
          />
        </div>
        <div>
          <h3>Create a title for your spot</h3>
          <p>
            Catch guests' attention with a spot title that highlights what makes
            your place special.
          </p>
        </div>
        <div>
          <label for="spot-name"></label>
          <input type="text" placeholder="Name of your spot" id="spot-name" />
        </div>
        <div>
          <h3>Set a base price for your spot</h3>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
        </div>
        <div>
          <label for="price">$ </label>
          <input type="text" placeholder="Price per night (USD)" id="price" />
        </div>
        <div>
          <h3>Liven up your spot with photos</h3>
          <p>Submit a link to at least one photo to publish your spot</p>
        </div>
        <div>
          <label for="previewImage"></label>
          <input
            type="text"
            placeholder="Preview Image URL"
            id="previewImage"
          />
          <br></br>
          <br></br>

          <label for="image1"></label>
          <input type="text" placeholder="Image URL" id="image1" />
          <br></br>
          <br></br>
          <label for="image2"></label>
          <input type="text" placeholder="Image URL" id="image2" />
          <br></br>
          <br></br>
          <label for="image3"></label>
          <input type="text" placeholder="Image URL" id="image3" />
          <br></br>
          <br></br>
          <label for="image4"></label>
          <input type="text" placeholder="Image URL" id="image4" />
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
