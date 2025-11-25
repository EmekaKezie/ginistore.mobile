import { ApiGetCollectionAccounts } from "@/apis/organisationApi/collectionAccountApi";
import { ApiGetStoreById } from "@/apis/organisationApi/storeApi";
import {
  ApiGetPosProductBatches,
  ApiGetPosProducts,
  ApiPosConfirmSale,
} from "@/apis/posApi";
import { generateCode } from "@/core/helpers/ecryptiontHelper";
import { paymentChannels } from "@/data/constants";
import { useAppDispatch, useAppSelector } from "@/redux/useReduxhooks";
import { IApiResponse } from "@/types/IApp";
import { ICollectionAccountView } from "@/types/ICollectionAccount";
import {
  IPosDetailInput,
  IPosInput,
  IPosProductBatchView,
  IPosProductsView,
} from "@/types/IPos";
import { IStoreView } from "@/types/IStore";
import { Picker } from "@react-native-picker/picker";
import { useCallback, useEffect, useState } from "react";
import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import {
  Button,
  IconButton,
  MD3Theme,
  Menu,
  Text,
  TextInput,
} from "react-native-paper";
import PointOfSaleHeader from "./PointOfSaleHeader";

type TScreen = "screen1" | "screen2" | "screen3";
type Tprops = {
  theme: MD3Theme;
};
export default function PointOfSale({ theme }: Tprops) {
  const authStore = useAppSelector((state) => state.authReducer).auth;
  const dispatch = useAppDispatch();

  const initAcct: ICollectionAccountView = {
    account_name: "",
    collection_account_id: "",
    company_id: "",
    bank_name: "",
    account_no: "",
    created_date: "",
    created_by: "",
    is_active: 0,
    store_id: "",
  };

  const initBatch: IPosProductBatchView = {
    batch_no: "",
    product_batch_id: "",
    current_unit_qty: 0,
    product_id: "",
  };

  const [storeItem, setStoreItem] = useState<IStoreView>();
  const [storeLoading, setStoreLoading] = useState(false);
  const [accountList, setAccountList] = useState<ICollectionAccountView[]>([]);
  const [accountItem, setAccountItem] =
    useState<ICollectionAccountView>(initAcct);
  const [accountLoading, setAccountLoading] = useState(false);
  const [screen, setScreen] = useState<TScreen>("screen1");
  const [productList1, setProductList1] = useState<IPosProductsView[]>([]);
  const [productList2, setProductList2] = useState<IPosProductsView[]>([]);
  const [productLoading, setProductLoading] = useState<boolean>(false);
  const [productSelected, setProductSelected] = useState<IPosProductsView[]>(
    []
  );
  const [productRefresh, setProductRefresh] = useState(false);
  const [batchList, setBatchList] = useState<IPosProductBatchView[]>([]);
  const [batchItem, setBatchItem] = useState<IPosProductBatchView>(initBatch);
  const [batchLoading, setBatchLoading] = useState(false);
  const [pressedId, setPressedId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [previewList, setPreviewList] = useState<IPosDetailInput[]>([]);
  const [previewItem, setPreviewItem] = useState<IPosDetailInput>();
  const [subtotal, setSubtotal] = useState<string>("");
  const [grandtotal, setGrandtotal] = useState<string>("");
  const [balance, setBalance] = useState<string>("");
  const [paidAmount, setPaidAmount] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<string>("");
  const [discountPercentage, setDiscountPercentage] = useState<string>("");
  const [vatAmount, setVatAmount] = useState<string>("");
  const [salesCode, setSalesCode] = useState(generateCode(6));
  const [paymentChannel, setPaymentChannel] = useState("");
  const [vat, setVat] = useState("");
  const [saving, setSaving] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<string>("");
  const [dialogReceipt, setDialogReceipt] = useState<boolean>(false);
  const [dialogMore, setDialogMore] = useState<boolean>(false);
  const [dialogSetting, setDialogSetting] = useState(false);
  const [menuPaymentChannel, setMenuPaymentChannel] = useState(false);
  const [menuCollectionAcct, setMenuCollectionAcct] = useState(false);

  useEffect(() => {
    fetchStore();
    fetchProductList();
    fetchAccountList();
  }, []);

  useEffect(() => {
    setProductList2(productList1);
  }, [productList1]);

  useEffect(() => {
    if (searchInput) {
      handleSearch(searchInput);
    }
  }, [searchInput]);

  useEffect(() => {
    handleCalc();
  }, [previewList, paidAmount, discountAmount]);

  useEffect(() => {
    if (previewItem) {
      fetchBatchList();
    }
  }, [previewItem]);

  const handleGoToPointOfSale1 = () => {
    setScreen("screen1");
  };

  const handleGoToPointOfSale2 = () => {
    setScreen("screen2");
  };

  const handleGoToPointOfSale3 = () => {
    setScreen("screen3");
  };

  const onProductRefresh = useCallback(() => {
    setProductRefresh(true);

    // Simulate fetching data
    setTimeout(() => {
      fetchProductList();
      setProductRefresh(false);
    }, 2000);
  }, []);

  const handleSearch = (value: string) => {
    setSearchInput(value);
    const filtered = productList1?.filter(
      (x) =>
        x.product_name?.toLowerCase().includes(value.toLocaleLowerCase()) ||
        x.product_code === value
    );
    setProductList2(filtered);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setProductList2(productList1);
  };

  const handleAddToList = (item: IPosProductsView) => {
    const find = previewList?.find((x) => x.product_id === item.product_id);
    if (find) {
      const remove = previewList?.filter(
        (x) => x.product_id !== item.product_id
      );
      const remove2 = productSelected?.filter(
        (x) => x.product_id !== item.product_id
      );

      setPreviewList(remove);
      setProductSelected(remove2);
    } else {
      setProductSelected((prev) => [...prev, item]);

      const vatAmount =
        (Number(item.unit_sell_price) * Number(item.vat_percentage)) / 100;

      const modifiedItem: IPosDetailInput = {
        product_id: item.product_id,
        product_name: item.product_name,
        unit_of_measure: Number(item.unit_of_measure),
        unit_sell_price: Number(item.unit_sell_price),
        sub_total_amount: Number(item.unit_sell_price),
        discount_amount: 0,
        discount_percentage: 0,
        total_amount: Number(item.unit_sell_price) + vatAmount,
        unit_qty: 1,
        stock_id: item.stock_id,
        currency_code: item.currency_code,
        product_batch_id: "",
        vat_amount: vatAmount,
        vat_percentage: Number(item.vat_percentage),
      };

      setPreviewList((previous: IPosDetailInput[]) => [
        ...previous,
        modifiedItem,
      ]);
    }
  };

  const handleRemoveFromList = (item: IPosDetailInput) => {
    const index = previewList.indexOf(item);
    const newarr = [...previewList];
    newarr.splice(index, 1);

    const filter = productSelected?.filter(
      (x) => x.product_id !== item.product_id
    );

    setProductSelected(filter);
    setPreviewList(newarr);
  };

  const handleDecreaseQty = (item: IPosDetailInput) => {
    const newQty = item.unit_qty - 1;
    const newItem: IPosDetailInput = {
      ...item,
      unit_qty: newQty,
      total_amount: Number(item.total_amount) - Number(item.unit_sell_price),
    };
    const index = previewList.indexOf(item);
    const newArr = [...previewList];
    newArr.splice(index, 1, newItem);
    setPreviewList(newArr);
  };

  const handleIncreaseQty = (item: IPosDetailInput) => {
    const newQty = item.unit_qty + 1;
    const newItem: IPosDetailInput = {
      ...item,
      unit_qty: newQty,
      total_amount: Number(item.total_amount) + Number(item.unit_sell_price),
    };
    const index = previewList.indexOf(item);
    const newArr = [...previewList];
    newArr.splice(index, 1, newItem);
    setPreviewList(newArr);
  };

  const handleCalc = () => {
    const calc: number = previewList?.reduce((prev, curr) => {
      const evaluate = prev + Number(curr.unit_sell_price) * curr.unit_qty;
      return evaluate;
    }, 0);

    const calcSubtotal = calc - Number(discountAmount);
    const calcDiscountPercent: number = (Number(discountAmount) / calc) * 100;
    const calcVatAmt: number = (calcSubtotal * Number(vat)) / 100;

    const calcGrandtotal: number = calcSubtotal + calcVatAmt;
    const calcBalance: number = Number(paidAmount) - calcGrandtotal;

    setSubtotal(calcSubtotal?.toString());
    setGrandtotal(calcGrandtotal?.toString());
    setBalance(calcBalance?.toString());
    setVatAmount(calcVatAmt?.toString());
    setDiscountPercentage(calcDiscountPercent?.toString());
  };

  const handleSaveTempData = () => {
    const tempData: IPosInput = {
      sale_code: salesCode,
      sub_total_amount: Number(subtotal),
      vat_percentage: Number(vat),
      vat_amount: Number(vatAmount),
      discount_percentage: Number(discountPercentage),
      discount_amount: Number(discountAmount),
      total_amount: Number(grandtotal),
      seller_user_id: authStore.user_id,
      seller_fullname: `${authStore.firstname} ${authStore.lastname}`,
      store_name: authStore.store_name,
      created_by: authStore.user_id,
      device_id: "",
      payment_channel: paymentChannel,
      collection_account_id: accountItem?.collection_account_id,
      paid_amount: Number(paidAmount),
      sale_date: new Date().toISOString(),
      currency_code: authStore.currency_code,
      sale_details: previewList,
    };
    return tempData;
  };

  const handleClearAll = () => {
    setProductSelected([]);
    setPreviewList([]);
    setAccountItem(initAcct);
    setPaidAmount("");
    setDiscountAmount("");
    setDiscountPercentage("");
    setSalesCode(generateCode(6));
  };

  const handleConfirmSales = async () => {
    setSaving(true);

    try {
      const payload = handleSaveTempData();

      if (payload.paid_amount < 1) {
        // enqueueSnackbar("Please enter the paid amount", {
        //   variant: "default",
        //   anchorOrigin: { vertical: "top", horizontal: "center" },
        // });

        console.log("Please enter the paid amount");
        return;
      }

      if (
        paymentChannel !== paymentChannels[0].id &&
        accountList?.length > 0 &&
        !payload.collection_account_id
      ) {
        // enqueueSnackbar("Please select collection account", {
        //   variant: "default",
        //   anchorOrigin: { vertical: "top", horizontal: "center" },
        // });

        return;
      }

      const res: IApiResponse<any> = await ApiPosConfirmSale(payload);
      if (res.status === "success") {
        setReceipt(res.message);
        setDialogReceipt(true);
        handleClearAll();
        setScreen("screen1");
      } else {
        console.log(res);
        //errorHandlerHelper(res, dispatch, authStore.email);
      }
    } catch (error) {
      // enqueueSnackbar(
      //   "Something went wrong. Please check your internet and try again",
      //   {
      //     variant: "default",
      //     anchorOrigin: { vertical: "top", horizontal: "center" },
      //   }
      // );
      console.log(error);
    } finally {
      setSaving(false);
      setSalesCode(generateCode(6));
    }
  };

  const fetchStore = async () => {
    setStoreLoading(true);
    try {
      const res: IApiResponse<IStoreView> = await ApiGetStoreById();
      if (res?.status === "success") {
        setStoreItem(res?.data);
        setVat(res?.data?.vat_percentage?.toString());
      } else {
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setStoreLoading(false);
    }
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

  const fetchBatchList = async () => {
    setBatchLoading(true);
    try {
      const res: IApiResponse<IPosProductBatchView[]> =
        await ApiGetPosProductBatches(previewItem?.product_id!);

      if (res?.status === "success") {
        setBatchList(res?.data);
      } else {
        console.log(res);
      }
    } catch (error) {
    } finally {
      setBatchLoading(false);
    }
  };

  const fetchAccountList = async () => {
    setAccountLoading(true);
    try {
      const res: IApiResponse<ICollectionAccountView[]> =
        await ApiGetCollectionAccounts();

      if (res?.status === "success") {
        setAccountList(res?.data);
      } else {
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAccountLoading(false);
    }
  };

  const handleRenderContent = () => {
    if (productLoading) {
      return <Text>Loading</Text>;
    } else {
      if (productList1?.length < 1) {
        return <Text>No Products found</Text>;
      } else {
        return renderContent();
      }
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
      <View style={{ flex: 1 }}>
        <View
          style={{
            paddingHorizontal: 15,
            flexDirection: "row",
            alignItems: "center",
          }}>
          <View style={{ flexGrow: 1 }}>
            <PointOfSaleHeader theme={theme} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {previewList?.length > 0 && (
              <Text>{previewList?.length} Selected</Text>
            )}
            <IconButton
              icon={"chevron-right"}
              size={30}
              onPress={handleGoToPointOfSale2}
            />
          </View>
        </View>
        <View
          style={{
            //backgroundColor: (theme.colors as any).backgroundPaper,
            // borderWidth: 1,
            //borderRadius: 50,
            marginBottom: 10,
          }}>
          <TextInput
            value={searchInput}
            onChangeText={(text) => handleSearch(text)}
            placeholder="Search product"
            mode="outlined"
            focusable
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            left={<TextInput.Icon icon="magnify" />}
            right={
              searchInput && (
                <TextInput.Icon icon="close" onPress={handleClearSearch} />
              )
            }
            theme={{
              roundness: 30, // important
            }}
            style={{
              backgroundColor: (theme.colors as any).backgroundPaper,
              //borderRadius: 30, // matches theme.roundness
              marginHorizontal: 15,
              //borderWidth: 1,
            }}
          />
        </View>
        {/* <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
          <TouchableRipple
            onPress={handleGoToPointOfSale2}
            borderless
            rippleColor="rgba(255,255,255,0.2)"
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: theme.colors.primary,
              paddingLeft: 15,
              borderRadius: 50,
              alignSelf: "flex-start",
              marginLeft: "auto",
            }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}>
              <Text style={{ color: "white", fontSize: 12, marginRight: 4 }}>
                {productSelected?.length} Selected
              </Text>
              <IconButton
                icon="chevron-right"
                size={16}
                style={{ margin: 0 }}
                iconColor="white"
              />
            </View>
          </TouchableRipple>
        </View> */}
        {/* <Text>Product List</Text>
        <Button onPress={handleGoToPointOfSale2}>Next</Button> */}

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={productRefresh}
              onRefresh={onProductRefresh}
            />
          }
          style={{ paddingHorizontal: 15 }}>
          {productList2?.map((i) => {
            const isSelected = !productSelected?.find(
              (x) => x.product_id === i.product_id
            )
              ? false
              : true;
            const isOutOfStock = i?.unit_stock_level < 1 ? true : false;
            const isPriceUnset = i?.unit_sell_price < 1 ? true : false;

            return (
              // <List.Item
              //   key={i?.product_id}
              //   title={i?.product_name}
              //   onPressIn={() => setPressedId(i.product_id)}
              //   onPressOut={() => setPressedId(null)}
              //   onPress={() => {
              //     setPressedId(i.product_id);
              //     console.log(i.product_id);
              //   }}
              //   left={(props) => <List.Icon {...props} icon="cube-outline" />}
              //   right={(props) => <List.Icon {...props} icon="chevron-right" />}
              //   style={{
              //     marginVertical: 4,
              //     marginHorizontal: 8,
              //     borderRadius: 8,
              //     backgroundColor: pressedId === i.product_id ? "red" : "#fff", // makes ripple more visible
              //   }}
              // />

              <Pressable
                key={i.product_id}
                onPressIn={() => setPressedId(i.product_id)}
                onPressOut={() => setPressedId(null)}
                onPress={() => handleAddToList(i)}
                style={{
                  backgroundColor:
                    pressedId === i?.product_id
                      ? theme.colors.inversePrimary
                      : (theme.colors as any).backgroundPaper,
                  padding: 15,
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginVertical: 3,
                  borderBottomColor: theme.colors.background,
                  borderRadius: 20,
                }}>
                {isSelected && (
                  <IconButton
                    icon="checkbox-marked-circle"
                    size={18}
                    iconColor={(theme.colors as any).success} // color
                    style={{ padding: 0, margin: -2 }}
                  />
                )}
                <View
                  style={{
                    flexDirection: "row",
                    flexGrow: 1,
                    justifyContent: "space-between",
                  }}>
                  <View>
                    <Text
                      variant="titleSmall"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        width: 220,
                        color: theme.colors.onSurface,
                      }}>
                      {i.product_name}
                    </Text>
                    <Text
                      variant="bodyMedium"
                      style={{ color: theme.colors.surfaceVariant }}>
                      {i.product_code}
                    </Text>
                  </View>
                  <View style={{}}>
                    <Text variant="bodyMedium">
                      {Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: i.currency_code,
                      }).format(i?.unit_sell_price)}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderProductPreview = () => {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            paddingHorizontal: 15,
            flexDirection: "row",
            alignItems: "center",
          }}>
          <View style={{ flexGrow: 1 }}>
            <PointOfSaleHeader theme={theme} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* {previewList?.length > 0 && (
              <Text>{previewList?.length} Selected</Text>
            )} */}
            <IconButton
              icon={"chevron-left"}
              size={30}
              onPress={handleGoToPointOfSale1}
            />
            <IconButton
              icon={"chevron-right"}
              size={30}
              onPress={handleGoToPointOfSale3}
            />
          </View>
        </View>
        <ScrollView>
          {previewList?.map((i) => {
            return (
              <View
                key={i?.product_id}
                style={{
                  marginVertical: 5,
                  marginHorizontal: 15,
                  backgroundColor: (theme.colors as any).backgroundPaper,
                  padding: 10,
                  //borderWidth: 1,
                  borderRadius: 20,
                }}>
                {/* <List.Item
                  title={i?.product_name}
                  description={`UOM: ${i?.unit_of_measure}`}
                  right={() => (
                    <View>
                      <Text>
                        {" "}
                        {Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: i.currency_code,
                        }).format(i?.unit_sell_price)}
                      </Text>
                    </View>
                  )}
                /> */}
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}>
                  <View style={{}}>
                    <Text
                      variant="titleSmall"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        width: 220,
                        color: theme.colors.onSurface,
                      }}>
                      {i.product_name}
                    </Text>
                    <Text
                      variant="bodyMedium"
                      style={{
                        color: theme.colors.surfaceVariant,
                        fontSize: 12,
                      }}>
                      Unit of Measure: {i.unit_of_measure}
                    </Text>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}>
                    <Text variant="bodyLarge">
                      {Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: i.currency_code,
                      }).format(i?.total_amount)}
                    </Text>
                    {/* <IconButton
                      icon="arrow-top-right-thin-circle-outline"
                      size={25}
                      style={{ margin: 0, padding: 0 }}
                    />
                    <IconButton
                      icon="close-circle"
                      size={25}
                      style={{ margin: 0, padding: 0 }}
                    /> */}
                  </View>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 3,
                    backgroundColor: theme.colors.background,
                    borderRadius: 50,
                  }}>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      //backgroundColor: theme.colors.background,
                      //borderRadius: 50,
                    }}>
                    <IconButton
                      icon="minus"
                      size={20}
                     
                      style={{ margin: 0, padding: 0 }}
                      onPress={() => handleDecreaseQty(i)}
                      disabled={i?.unit_qty === 1}
                    />
                    <Text>{i?.unit_qty}</Text>
                    <IconButton
                      icon="plus"
                      size={20}
                      style={{ margin: 0, padding: 0 }}
                      onPress={() => handleIncreaseQty(i)}
                    />
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}>
                    <IconButton
                      icon="arrow-top-right-thin-circle-outline"
                      size={20}
                       iconColor={(theme.colors as any).info}
                      style={{ margin: 0, padding: 0 }}
                    />
                    <IconButton
                      icon="close-circle"
                      size={20}
                       iconColor={theme.colors.error}
                      style={{ margin: 0, padding: 0 }}
                      onPress={() => handleRemoveFromList(i)}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* <Text>Product Preview</Text>
        <Button onPress={handleGoToPointOfSale1}>Prev</Button>
        <Button onPress={handleGoToPointOfSale3}>Next</Button> */}
      </View>
    );
  };

  const renderProductAction = () => {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            paddingTop: 40,
            backgroundColor: (theme.colors as any).backgroundPaper,
            display: "flex",
            flexDirection: "row",
          }}>
          <Button onPress={handleGoToPointOfSale2}>Prev</Button>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 10, paddingTop: 10 }}>
          <View
            style={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}>
            {/* <View
              style={{
                flexDirection: "row",
                gap: 10,
              }}> */}
            <View>
              <TextInput
                mode="outlined"
                label="Subtotal"
                outlineColor="transparent"
                style={{
                  backgroundColor: (theme.colors as any).backgroundPaper,
                }}
                value={subtotal}
                editable={false}
                // style={{ flex: 1 }}
              />
            </View>

            <View>
              <TextInput
                mode="outlined"
                label="V.A.T"
                outlineColor="transparent"
                value={vat}
                editable={false}
                // style={{ flex: 1 }}
              />
            </View>
            {/* </View> */}

            <View>
              <TextInput
                mode="outlined"
                label="Total + V.A.T"
                outlineColor="transparent"
                value={grandtotal}
                editable={false}
              />
            </View>
            <View>
              <TextInput
                mode="outlined"
                label="Balance"
                outlineColor="transparent"
                value={balance}
                disabled
              />
            </View>
          </View>
          <View style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <View>
              <Menu
                visible={menuCollectionAcct}
                onDismiss={() => setMenuPaymentChannel(false)}
                anchor={
                  <TextInput
                    mode="outlined"
                    label="Select Collection Account"
                    value={accountItem.collection_account_id}
                    onPressIn={() => setMenuCollectionAcct(true)}
                  />
                }>
                {accountList?.map((i) => (
                  <Menu.Item
                    key={i.collection_account_id}
                    title={i.account_name}
                    onPress={() => {
                      setAccountItem({
                        ...accountItem,
                        collection_account_id: i.collection_account_id,
                        account_name: i.account_name,
                        bank_name: i.bank_name,
                        account_no: i.account_no,
                      });
                      setMenuCollectionAcct(false);
                    }}
                  />
                ))}
              </Menu>
            </View>
            <View>
              <Picker
                selectedValue={paymentChannel}
                onValueChange={(val, idx) => setPaymentChannel(val)}>
                {paymentChannels?.map((i) => (
                  <Picker.Item key={i?.id} value={i?.id} label={i.name} />
                ))}
              </Picker>
              <Menu
                visible={menuPaymentChannel}
                onDismiss={() => setMenuPaymentChannel(false)}
                anchor={
                  <TextInput
                    mode="outlined"
                    label="Select option"
                    value={paymentChannel}
                    onPressIn={() => setMenuPaymentChannel(true)}
                  />
                }>
                {paymentChannels?.map((i) => (
                  <Menu.Item
                    key={i.id}
                    title={i.name}
                    onPress={() => {
                      setPaymentChannel(i.id);
                      setMenuPaymentChannel(false);
                    }}
                  />
                ))}
              </Menu>
            </View>
            <View>
              <TextInput
                mode="outlined"
                label="Discount Amount"
                value={discountAmount}
                onChangeText={(val) => setDiscountAmount(val)}
              />
            </View>
            <View>
              <TextInput
                mode="outlined"
                label="Paid Amount"
                value={paidAmount}
                onChangeText={(val) => setPaidAmount(val)}
              />
            </View>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 10,
              }}>
              <Button
                mode="contained"
                style={{
                  //borderWidth: 1,
                  aspectRatio: "1/1",
                  borderRadius: 10,
                  flex: 1,
                  justifyContent: "center",
                  backgroundColor: (theme.colors as any).warning,
                }}>
                <Text style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
                  Hold
                </Text>
              </Button>
              <Button
                mode="contained"
                style={{
                  //borderWidth: 1,
                  aspectRatio: "1/1",
                  borderRadius: 10,
                  flex: 1,
                  justifyContent: "center",
                  backgroundColor: (theme.colors as any).error,
                }}>
                <Text style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
                  Clear
                </Text>
              </Button>
              <Button
                mode="contained"
                style={{
                  //borderWidth: 1,
                  aspectRatio: "1/1",
                  borderRadius: 10,
                  flex: 1,
                  justifyContent: "center",
                  backgroundColor: (theme.colors as any).success,
                }}
                onPress={handleConfirmSales}>
                <Text style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
                  Confirm
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return <View style={{ flex: 1 }}>{handleRenderContent()}</View>;
}
