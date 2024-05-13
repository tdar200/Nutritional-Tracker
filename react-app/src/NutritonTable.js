import React, { useEffect, useState, useMemo, useRef } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TextField, Button } from "@mui/material";

import { createStyles, makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      //   display: "flex",
      //   width: "100%",
    },
    containerLeft: {
      //   flex: "1", // Occupies 33% space
      //   marginRight: "5px", // Add some space between containers
    },
    containerRight: {
      //   flex: "4", // Occupies 66% space
    },
    headerColumn: {
      //   flex: "1",
    },
    dataColumn: {
      //   flex: "1",
    },
  })
);

function NutritonTable({ data }) {
  const [localData, setLocalData] = useState(
    JSON.parse(localStorage.getItem("ingredients"))
  );

  const classes = useStyles();
  const newData = useMemo(() => {
    const arr = [];
    if (!data) {
      return;
    }
    const keys = Object.keys(data?.totalDaily);

    const ingredientText = data?.ingredients?.[0]?.parsed?.[0]?.food;

    arr.push({
      label: "Ingredient",
      quantity: ingredientText,
    });
    arr.push({
      label: "Total Weight",
      quantity: data?.totalWeight,
      multiplier: 1,
      originalValue: data?.totalWeight,
    });

    keys.forEach((key) => {
      const value = data?.totalDaily[key];

      arr.push({ label: value.label, quantity: value.quantity });
    });

    return arr;
  }, [data]);

  const handleClick = () => {
    const storedItems = JSON.parse(localStorage.getItem("ingredients")) ?? {};

    const ingredientText = data?.ingredients?.[0]?.parsed?.[0]?.food;

    storedItems[ingredientText] = newData;

    localStorage.setItem("ingredients", JSON.stringify(storedItems));
    setLocalData(storedItems);
  };

  const flattedArr = useMemo(() => {
    const localKeys = localData && Object.keys(localData);

    return localKeys?.map((key) => {
      const currentMultiplier = localData[key].find(
        (k) => k.label === "Total Weight"
      )?.multiplier;

      console.log({ currentMultiplier, localData, localKeys });

      return [
        ...localData[key]?.map(({ label, quantity, value, multiplier }) => {
          if (label === "Energy") {
            quantity = quantity * 10;
          }

          return {
            label,
            quantity:
              isFinite(quantity) && label !== "Total Weight"
                ? quantity + quantity * currentMultiplier
                : label === "Total Weight" && value
                ? value
                : quantity,
          };
        }),
      ];
    });
  }, [JSON.stringify(localData)]);

  console.log({ flattedArr });

  const labelTotals = useMemo(() => {
    return flattedArr
      ?.flatMap((subArr) => subArr)
      .reduce((totals, { label, quantity }) => {
        if (!totals[label]) {
          totals[label] = 0;
        }
        if (typeof quantity === "number") {
          totals[label] += quantity;
        }

        return totals;
      }, {});
  }, [flattedArr]);

  const quantityChangeHandler = (e, ingredient, prevValue) => {
    const value = +e.target.value;
    const currentFocus = e.target === document.activeElement;

    if (value < 0) {
      return;
    }

    const storedItems = localData ?? {};

    const updatedItems = JSON.parse(JSON.stringify(storedItems));

    const findIngredient = updatedItems[ingredient].find(
      (i) => i.label === "Total Weight"
    );

    const percentageChange =
      (value - findIngredient.originalValue) / findIngredient.originalValue;

    findIngredient.multiplier = percentageChange;
    findIngredient.value = value;

    localStorage.setItem("ingredients", JSON.stringify(updatedItems));
    setLocalData(updatedItems);

    if (currentFocus) {
      e.target.focus();
    }
  };

  const handleDelete = (item) => {
    console.log({ item, localData });

    const filteredItemKey = item[0].quantity;

    const { [filteredItemKey]: deletedItem, ...updatedData } = localData;

    localStorage.setItem("ingredients", JSON.stringify(updatedData));
    setLocalData(updatedData);
  };

  return (
    <>
      <TableContainer component={Paper} className={classes.container}>
        <Table sx={{ minWidth: 300 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {newData?.map(({ label, quantity }, index) => {
                return (
                  <TableCell key={`header-${label}-${index}`}>
                    {label}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {newData &&
                newData.map(({ label, quantity }, index) => (
                  <TableCell
                    key={`${index}-${quantity}`}
                    className={classes.dataColumn}
                  >
                    {isFinite(quantity) ? quantity?.toFixed(2) : quantity}
                  </TableCell>
                ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={handleClick}>Add Item</Button>
      <TableContainer className={classes.container}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {flattedArr?.[0]?.map(({ label, quantity }, index) => {
                return (
                  <TableCell key={`footer-${label}-${index}`}>
                    {label}
                  </TableCell>
                );
              })}
              <TableCell key={`footer-delete}`}>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flattedArr?.map((item, index) => (
              <TableRow>
                {item.map(({ quantity, label }, index) => {
                  return label === "Total Weight" ? (
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      type="text"
                      value={quantity}
                      onChange={(e) =>
                        quantityChangeHandler(e, item[0].quantity, quantity)
                      }
                      key={`${index}-${quantity}-${label}`}
                    />
                  ) : (
                    <TableCell key={`header-${quantity}-${index}`}>
                      {isFinite(quantity) ? quantity?.toFixed(2) : quantity}
                    </TableCell>
                  );
                })}
                <TableCell>
                  <Button onClick={() => handleDelete(item)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              {flattedArr?.[0]?.map(({ label, quantity }, index) => {
                if (label === "Ingredient") {
                  return <TableCell></TableCell>;
                } else {
                  return <TableCell>{labelTotals[label].toFixed(2)}</TableCell>;
                }
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default NutritonTable;
