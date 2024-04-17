import React, { useEffect, useState, useMemo } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TextField } from "@mui/material";

import { createStyles, makeStyles } from "@mui/styles";
import { Button } from "@mui/material";

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

function NutritonTable({ data, localData, setLocalData }) {
  const classes = useStyles();
  // const [multiplierObj, setMultiplierObj] = useState({});

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

    setLocalData(storedItems);
    storedItems[ingredientText] = newData;

    localStorage.setItem("ingredients", JSON.stringify(storedItems));
  };

  const localKeys = localData && Object.keys(localData);

  const localStorageVar = localStorage.getItem("ingredients");

  const flattedArr = useMemo(() => {
    return localKeys?.map((key) => {
      const currentMultiplier = localData[key].find(
        (k) => k.label === "Total Weight"
      ).multiplier;

      return [
        // {
        //   label: "Ingredient",
        //   quantity: key,
        // },
        ...localData[key]?.map(({ label, quantity, multiplier }) => {
          // if (multiplierObj[key]) {
          //   return {
          //     label,
          //     quantity: isFinite(quantity)
          //       ? label !== "Total Weight"
          //         ? quantity * multiplierObj[key].multiplier
          //         : Number(multiplierObj[key].value)
          //       : quantity,
          //   };
          // }

          // console.log({ label, quantity, multiplier });
          // if (label === "Total Weight" && !multiplierObj[key]) {
          //   // const storedItems = JSON.parse(localStorage.getItem("ingredients")) ?? {};

          //   // const ingredientText = data?.ingredients?.[0]?.parsed?.[0]?.food;

          //   // setLocalData(storedItems);
          //   // storedItems[ingredientText] = newData;

          //   // localStorage.setItem("ingredients", JSON.stringify(storedItems));

          //   const newObj = { ...multiplierObj };

          //   const addObj = {
          //     multiplier: 1,
          //     value: quantity,
          //     originalValue: quantity,
          //   };

          //   newObj[key] = addObj;

          //   setMultiplierObj(newObj);
          // }

          return {
            label,
            quantity: isFinite(quantity)
              ? quantity * currentMultiplier
              : quantity,
          };
        }),
      ];
    });
  }, [localKeys, localData, localStorageVar]);

  useEffect(() => {}, [flattedArr]);

  const labelTotals = useMemo(() => {
    return flattedArr
      ?.flatMap((subArr) => subArr)
      .reduce((totals, { label, quantity }) => {
        if (!totals[label]) {
          totals[label] = 0;
        }
        totals[label] += quantity;
        return totals;
      }, {});
  }, [flattedArr]);

  const quantityChangeHandler = (e, ingredient, prevValue) => {
    const value = e.target.value;

    // const newObj = { ...multiplierObj };

    // newObj[ingredient] = { ...newObj[ingredient], multiplier, value };

    const storedItems = JSON.parse(localStorage.getItem("ingredients")) ?? {};

    // const ingredientText = data?.ingredients?.[0]?.parsed?.[0]?.food;

    const findIngredient = storedItems[ingredient].find(
      (i) => i.label === "Total Weight"
    );

    const multiplier = Number(value) / findIngredient.originalValue;

    console.log({ ingredient, value, storedItems, findIngredient, multiplier });

    findIngredient.multiplier = multiplier;
    findIngredient.quantity = +value;

    // setLocalData(storedItems);
    // storedItems[ingredientText] = newData;

    localStorage.setItem("ingredients", JSON.stringify(storedItems));

    // setMultiplierObj(newObj);
  };

  console.log({ labelTotals, flattedArr });

  const handleDelete = (item) => {
    console.log({ item });
  };

  console.log({ flattedArr });

  return (
    <>
      <TableContainer component={Paper} className={classes.container}>
        <Table sx={{ minWidth: 300 }} aria-label='simple table'>
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
                    className={classes.dataColumn}>
                    {isFinite(quantity) ? quantity?.toFixed(2) : quantity}
                  </TableCell>
                ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Button onClick={handleClick}>Add Item</Button>
      <TableContainer className={classes.container}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              {flattedArr?.[0]?.map(({ label, quantity }, index) => {
                return (
                  <TableCell key={`header-${label}-${index}`}>
                    {label}
                  </TableCell>
                );
              })}
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flattedArr?.map((item, index) => (
              <TableRow>
                {item.map(({ quantity, label }, index) => {
                  return label === "Total Weight" ? (
                    <TextField
                      id='outlined-basic'
                      variant='outlined'
                      type='number'
                      value={quantity}
                      onChange={(e) =>
                        quantityChangeHandler(e, item[0].quantity, quantity)
                      }
                      inputProps={{
                        min: 1,
                        max: 10000,
                      }}
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
