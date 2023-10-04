// Use DBML to define your database structure
// Docs: https://dbml.dbdiagram.io/docs

Table Users {
id integer PK
firstName string
lastName string
email string
userName string
hashedPassword string
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
createdAt timestamp
updatedAt timestamp
}
Ref: "Spots"."ownerId" > "Users"."id"

Table SpotImages {
id integer PK
spotId integer
url string
preview boolean
createdAt timestamp
updatedAt timestamp
}
Ref: "SpotImages"."spotId" > "Spots"."id"

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

Table ReviewImages {
id integer PK
reviewId integer
url string
createdAt timestamp
updatedAt timestamp
}
Ref: "ReviewImages"."reviewId" > "Reviews"."id"

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
