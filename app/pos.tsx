import { ApiGetPosProducts } from "@/apis/posApi";
import PosLayout from "@/core/layout/PosLayout";
import { IApiResponse } from "@/types/IApp";
import { IPosProductsView } from "@/types/IPos";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

type TScreen = "screen1" | "screen2" | "screen3";

export default function PosScreen() {
  const [screen, setScreen] = useState<TScreen>("screen1");
  const [productList1, setProductList1] = useState<IPosProductsView[]>([]);
  const [productList2, setProductList2] = useState<IPosProductsView[]>([]);
  const [productLoading, setProductLoading] = useState<boolean>(false);
  const [productSelected, setProductSelected] = useState<IPosProductsView[]>(
    []
  );
  console.log(productList1)

  useEffect(() => {
    fetchProductList();
  }, []);

  useEffect(() => {
    setProductList2(productList1);
  }, [productList1]);

  const handleGoToPointOfSale1 = () => {
    setScreen("screen1");
  };

  const handleGoToPointOfSale2 = () => {
    setScreen("screen2");
  };

  const handleGoToPointOfSale3 = () => {
    setScreen("screen3");
  };

  const fetchProductList = async () => {
    setProductLoading(true);
    try {
      const res: IApiResponse<IPosProductsView[]> = await ApiGetPosProducts();
      if (res?.status === "success") {
        setProductList1(res?.data);
      } else {
        //errorHandlerHelper(res, dispatch, authStore.email);
        console.log("failed", res?.message);
      }
    } catch (error) {
      //   enqueueSnackbar("Unable to retrieve pos products. Please try again", {
      //     variant: "default",
      //     anchorOrigin: {
      //       horizontal: "center",
      //       vertical: "top",
      //     },
      //   });
      console.log("error", error);
    } finally {
      setProductLoading(false);
    }
  };

  const renderContent = () => {
    if (screen === "screen1") {
      return renderProductList();
    }
    if (screen === "screen2") {
      return renderProductPreview();
    }
    if (screen === "screen3") {
      return renderProductAction();
    }
  };

  const renderProductList = () => {
    return (
      <View>
        <Text>Product List</Text>
        <Button onPress={handleGoToPointOfSale2}>Next</Button>
      </View>
    );
  };

  const renderProductPreview = () => {
    return (
      <View>
        <Text>Product Preview</Text>
        <Button onPress={handleGoToPointOfSale1}>Prev</Button>
        <Button onPress={handleGoToPointOfSale3}>Next</Button>
      </View>
    );
  };

  const renderProductAction = () => {
    return (
      <View>
        <Text>Product Action</Text>
        <Button onPress={handleGoToPointOfSale2}>Prev</Button>
      </View>
    );
  };

  return (
    <PosLayout>
      {(theme) => (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "stretch",
          }}>
          {renderContent()}
        </View>
      )}
    </PosLayout>
  );
}
