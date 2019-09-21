CREATE TABLE accounts (
  EmailAddress      VARCHAR(40) NOT NULL,
  FirstName         VARCHAR(20) NOT NULL,
  LastName          VARCHAR(25) NOT NULL,
  Password          VARCHAR(30) NOT NULL,
  PaymentId         INT unsigned,
  ShippingId        INT unsigned,
  PhoneNumber       VARCHAR(15) NOT NULL,
  PRIMARY KEY       (EmailAddress)
);

CREATE TABLE trucks (
  TruckId           INT unsigned NOT NULL AUTO_INCREMENT,
  ContactEmail      VARCHAR(40) NOT NULL,
  Brand             VARCHAR(25) NOT NULL,
  Picture           BLOB,
  TruckName         VARCHAR(40) NOT NULL,
  DriveType         VARCHAR(20) NOT NULL,
  KMPerHour         VARCHAR(10) NOT NULL,
  FuelType          VARCHAR(15) NOT NULL,
  TruckDescription  VARCHAR(200),
  Color             VARCHAR(20) NOT NULL,
  PRIMARY KEY       (TruckId),
  FOREIGN KEY       (ContactEmail) REFERENCES accounts(EmailAddress) ON DELETE CASCADE
);

CREATE TABLE trailers (
  TrailerId            INT unsigned NOT NULL AUTO_INCREMENT,
  ContactEmail         VARCHAR(40) NOT NULL,
  Brand                VARCHAR(25) NOT NULL,
  Length               DOUBLE NOT NULL,
  Width                DOUBLE NOT NULL,
  Picture              BLOB,
  TrailerName          VARCHAR(40) NOT NULL,
  Color                VARCHAR(20) NOT NULL,
  TrailerDescription   VARCHAR(200),
  PRIMARY KEY          (TrailerId),
  FOREIGN KEY          (ContactEmail) REFERENCES accounts(EmailAddress) ON DELETE CASCADE
);

CREATE TABLE admins(
  EmailAddress      VARCHAR(40) NOT NULL,
  FirstName         VARCHAR(20) NOT NULL,
  LastName          VARCHAR(25) NOT NULL,
  Password          VARCHAR(30) NOT NULL,
  PRIMARY KEY       (EmailAddress)
);

CREATE TABLE parts(
  PartId            INT unsigned NOT NULL AUTO_INCREMENT,
  Quantity          INT NOT NULL,
  Price             DOUBLE NOT NULL,
  PartDescription   VARCHAR(200),
  Brand             VARCHAR(20) NOT NULL,
  Category          VARCHAR(30) NOT NULL,
  Picture           BLOB,
  ItemName          VARCHAR(40) NOT NULL,
  PRIMARY KEY       (PartId)
);

CREATE TABLE paymentDetails (
  PaymentId         INT unsigned NOT NULL AUTO_INCREMENT,
  CardNum           INT unsigned NOT NULL,
  CardMonth         VARCHAR(10) NOT NULL,
  CardYear          VARCHAR(10) NOT NULL,
  SecurityCode      VARCHAR(10) NOT NULL,
  BillingAddress    VARCHAR(40) NOT NULL,
  BillingAddress2   VARCHAR(40) NOT NULL,
  BillingFirstName  VARCHAR(20) NOT NULL,
  BillingLastName   VARCHAR(25) NOT NULL,
  BillingCountry    VARCHAR(30) NOT NULL,
  BillingCity       VARCHAR(20) NOT NULL,
  BillingState      VARCHAR(20) NOT NULL,
  BillingZIP        VARCHAR(15) NOT NULL,
  BillingPhone      VARCHAR(15) NOT NULL,
  PRIMARY KEY       (PaymentId)
);

CREATE TABLE shippingDetails (
  ShippingId         INT unsigned NOT NULL AUTO_INCREMENT,
  ShippingAddress    VARCHAR(40) NOT NULL,
  ShippingAddress2   VARCHAR(40) NOT NULL,
  ShippingFirstName  VARCHAR(20) NOT NULL,
  ShippingLastName   VARCHAR(25) NOT NULL,
  ShippingCountry    VARCHAR(30) NOT NULL,
  ShippingCity       VARCHAR(20) NOT NULL,
  ShippingState      VARCHAR(20) NOT NULL,
  ShippingZIP        VARCHAR(15) NOT NULL,
  ShippingPhone      VARCHAR(15) NOT NULL,
);

CREATE TABLE orders (
  OrderId           INT unsigned NOT NULL AUTO_INCREMENT,
  ShippingId        INT unsigned NOT NULL,
  PaymentId         INT unsigned NOT NULL,
  EmailAddress      VARCHAR(40) NOT NULL,
  OrderStatus       VARCHAR(20) NOT NULL,
  PRIMARY KEY       (OrderId),
  FOREIGN KEY       (ShippingId) REFERENCES shippingDetails(ShippingId) ON DELETE CASCADE,
  FOREIGN KEY       (PaymentId) REFERENCES paymentDetails(PaymentId) ON DELETE CASCADE
);

CREATE TABLE orderedParts (
  OrderId           INT unsigned NOT NULL,
  PartId            INT unsigned NOT NULL,
  Quantity          INT NOT NULL,
  PRIMARY KEY       (OrderId, PartId),
  FOREIGN KEY       (OrderId) REFERENCES orders(OrderId) ON DELETE CASCADE,
  FOREIGN KEY       (PartId) REFERENCES parts(PartId) ON DELETE CASCADE,
);
