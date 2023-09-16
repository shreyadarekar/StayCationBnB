// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

Table Users {
  id integer PK
  firstName string
  lastName string
  contact_no integer
  email string
  userName string
  password string
  createdAt timestamp
  updatedAt timestamp
}

Table Spots{
  id integer PK
  ownerId integer
  address string
  city string
  state string
  country string
  lat decimal
  lng decimal
  name string
  description string
  price decimal
  avgRating decimal
  previewImage string
  createdAt timestamp
  updatedAt timestamp
}
Ref: "Spots"."ownerId" > "Users"."id"

Table Reviews {
  id integer PK
  userId integer
  spotId integer
  review string
  stars decimal
  createdAt timestamp
  updatedAt timestamp
}
Ref: "Reviews"."userId" > "Users"."id"
Ref: "Reviews"."spotId" > "Spots"."id"

Table Bookings {
  id integer PK
  userId integer
  spotId integer
  startDate timestamp
  endDate timestamp
  createdAt timestamp
  updatedAt timestamp
}
Ref: "Bookings"."spotId" > "Spots"."id"
Ref: "Bookings"."userId" > "Users"."id"

Table Images {
  id integer PK
  spotId integer
  reviewId integer
  url string
  createdAt timestamp
  updatedAt timestamp
}
Ref: "Images"."spotId" > "Spots"."id"
Ref: "Images"."reviewId" > "Reviews"."id"
