import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";

actor {
  type PlantEntry = {
    id : Nat;
    name : Text;
    soilType : Text;
    seedStartDate : Time.Time;
    dailyLightHours : Float;
    germinationDate : ?Time.Time;
  };

  module PlantEntry {
    public func compareByName(p1 : PlantEntry, p2 : PlantEntry) : Order.Order {
      Text.compare(p1.name, p2.name);
    };
  };

  var nextId = 0;
  let plantEntries = Map.empty<Nat, PlantEntry>();

  public shared ({ caller }) func createPlanting(
    name : Text,
    soilType : Text,
    seedStartDate : Time.Time,
    dailyLightHours : Float,
    germinationDate : ?Time.Time,
  ) : async Nat {
    let newPlant : PlantEntry = {
      id = nextId;
      name;
      soilType;
      seedStartDate;
      dailyLightHours;
      germinationDate;
    };

    plantEntries.add(nextId, newPlant);
    nextId += 1;
    newPlant.id;
  };

  public query ({ caller }) func getPlantEntry(id : Nat) : async PlantEntry {
    switch (plantEntries.get(id)) {
      case (null) { Runtime.trap("No plant entry with id " # id.toText()) };
      case (?plantEntry) { plantEntry };
    };
  };

  public shared ({ caller }) func updatePlantEntry(
    id : Nat,
    name : Text,
    soilType : Text,
    seedStartDate : Time.Time,
    dailyLightHours : Float,
    germinationDate : ?Time.Time,
  ) : async () {
    if (not plantEntries.containsKey(id)) {
      Runtime.trap("No plant entry with id " # id.toText());
    };
    let updatedPlant : PlantEntry = {
      id;
      name;
      soilType;
      seedStartDate;
      dailyLightHours;
      germinationDate;
    };
    plantEntries.add(id, updatedPlant);
  };

  public shared ({ caller }) func deletePlantEntry(id : Nat) : async () {
    if (not plantEntries.containsKey(id)) {
      Runtime.trap("No plant entry with id " # id.toText());
    };
    plantEntries.remove(id);
  };

  public query ({ caller }) func getAllPlantsSortedByName() : async [PlantEntry] {
    plantEntries.values().toArray().sort(PlantEntry.compareByName);
  };
};
