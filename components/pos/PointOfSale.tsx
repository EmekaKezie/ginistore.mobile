import { ApiGetCollectionAccounts } from "@/apis/organisationApi/collectionAccountApi";
import {
  ApiGetPosProductBatches,
  ApiGetPosProducts,
  ApiPosConfirmSale,
} from "@/apis/posApi";
import { ApiGetStoreById } from "@/apis/storeApi";
import { renderCurrencySymbol } from "@/core/helpers/currencyHelpers";
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
import * as LocalAuthentication from "expo-local-authentication";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  findNodeHandle,
  Pressable,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import {
  ActivityIndicator,
  Button,
  HelperText,
  IconButton,
  MD3Theme,
  Text,
  TextInput,
} from "react-native-paper";
import { captureRef } from "react-native-view-shot";
import WebView from "react-native-webview";
import PointOfSaleHeader from "./PointOfSaleHeader";

type TScreen = "screen1" | "screen2" | "screen3";
type Tprops = {
  theme: MD3Theme;
};
export default function PointOfSale({ theme }: Tprops) {
  const authStore = useAppSelector((state) => state.authReducer).auth;
  const settingStore = useAppSelector((state) => state.settingReducer);
  const dispatch = useAppDispatch();

  const initBatch: IPosProductBatchView = {
    batch_no: "",
    product_batch_id: "",
    current_unit_qty: 0,
    product_id: "",
  };

  const [storeItem, setStoreItem] = useState<IStoreView>();
  const [storeLoading, setStoreLoading] = useState(false);
  const [accountList, setAccountList] = useState<ICollectionAccountView[]>([]);
  const [accountSelected, setAccountSelected] = useState("");
  const [accountSelectedErr, setAccountSelectedErr] = useState("");
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
  const [paidAmount, setPaidAmount] = useState<string>("0");
  const [paidAmountErr, setPaidAmountErr] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<string>("0");
  const [discountPercentage, setDiscountPercentage] = useState<string>("");
  const [vatAmount, setVatAmount] = useState<string>("");
  const [salesCode, setSalesCode] = useState(generateCode(6));
  const [paymentChannel, setPaymentChannel] = useState("");
  const [vat, setVat] = useState("");
  const [saving, setSaving] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<any>();
  const receiptRef = useRef<View>(null);
  const [dialogMore, setDialogMore] = useState<boolean>(false);
  const [dialogSetting, setDialogSetting] = useState(false);
  const [menuPaymentChannel, setMenuPaymentChannel] = useState(false);
  const [menuCollectionAcct, setMenuCollectionAcct] = useState(false);

  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const openBottomSheet = () => setBottomSheetOpen(true);
  const closeBottomSheet = () => setBottomSheetOpen(false);

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
      collection_account_id: accountSelected,
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
    setAccountSelected("");
    setPaidAmount("");
    setDiscountAmount("");
    setDiscountPercentage("");
    setSalesCode(generateCode(6));
    setReceipt("");
    setBottomSheetOpen(false);
    setScreen("screen1");
  };

  const handleConfirmSales = async () => {
    setSaving(true);

    try {
      const payload = handleSaveTempData();

      if (payload.paid_amount < 1) {
        setPaidAmountErr("Please enter the paid amount");
        return;
      }

      if (
        paymentChannel !== paymentChannels[0].id &&
        accountList?.length > 0 &&
        !payload.collection_account_id
      ) {
        setAccountSelectedErr("Please select collection account");
        return;
      }
      const res: IApiResponse<any> = await ApiPosConfirmSale(payload);
      if (res.status === "success") {
        setReceipt(res.message);
        setBottomSheetOpen(true);
        //handleClearAll();
        //setScreen("screen1");
      } else {
        Alert.alert("Failed", res?.message);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Something went wrong. Please check your internet and try again"
      );
    } finally {
      setSaving(false);
      setSalesCode(generateCode(6));
    }
  };

  const handleBiometricLogin = async () => {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    let result: any;

    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      result = await LocalAuthentication.authenticateAsync({
        promptSubtitle: "Fingerprint Required",
        promptMessage: "Use Face ID to securely confirm sale",
      });
    } else if (
      types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)
    ) {
      result = await LocalAuthentication.authenticateAsync({
        promptSubtitle: "Face ID Required",
        promptMessage: "Use Face ID to securely confirm sale",
      });
    } else {
      result = true;
    }

    if (result.success) {
      handleConfirmSales();
    }
  };

  const handleShareReceiptAsImage = async () => {
    try {
      const node = findNodeHandle(receiptRef.current);
      if (!node) return;

      const uri = await captureRef(node, {
        format: "png",
        quality: 1,
      });

      await Sharing.shareAsync(uri);
      handleClearAll();
    } catch (error) {
      console.log("Error capturing:", error);
    }
  };

  const handleShareReceiptAsPDF = async () => {
    try {
      const { uri } = await Print.printToFileAsync({ html: receipt });
      await Sharing.shareAsync(uri);
      handleClearAll();
    } catch (error) {
      console.log("Error capturing:", error);
    }
  };

  const fetchStore = async () => {
    setStoreLoading(true);
    try {
      const res: IApiResponse<IStoreView> = await ApiGetStoreById(
        authStore.store_id
      );
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
      return (
        <View
          style={{
            flex: 1,
            //backgroundColor: "rgba(0,0,0,0.1)", // Transparent black
            justifyContent: "center",
            alignItems: "center",
          }}>
          <View>
            <ActivityIndicator size="large" />
            <Text>Loading products...</Text>
          </View>
        </View>
      );
    } else {
      if (productList1?.length < 1) {
        return (
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
            }}
            refreshControl={
              <RefreshControl
                refreshing={productRefresh}
                onRefresh={onProductRefresh}
              />
            }
            style={{ flex: 1 }}>
            <Text variant="bodyLarge">No Products found</Text>
            <Text style={{ color: theme.colors.surfaceDisabled, fontSize: 12 }}>
              Swipe down to refresh
            </Text>
          </ScrollView>
        );
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
      <View style={{}}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}>
          <View style={{ flexGrow: 1, paddingLeft: 15 }}>
            <PointOfSaleHeader theme={theme} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {previewList?.length > 0 && (
              <Text onPress={handleGoToPointOfSale2}>
                {previewList?.length} Selected
              </Text>
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
              roundness: 30,
            }}
            style={{
              backgroundColor: (theme.colors as any).backgroundPaper,
              marginHorizontal: 15,
            }}
          />
        </View>
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
              <Pressable
                key={i.product_id}
                onPressIn={() => setPressedId(i.product_id)}
                onPressOut={() => setPressedId(null)}
                onPress={() => handleAddToList(i)}
                disabled={isOutOfStock || isPriceUnset}
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
                    iconColor={(theme.colors as any).success}
                    style={{ padding: 0, margin: -2 }}
                  />
                )}
                {(isOutOfStock || isPriceUnset) && (
                  <IconButton
                    icon="information-slab-circle"
                    size={18}
                    iconColor={(theme.colors as any).error}
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
                        textDecorationLine: isOutOfStock
                          ? "line-through"
                          : "none",
                      }}>
                      {i.product_name}
                    </Text>
                    <Text
                      variant="bodyMedium"
                      style={{ color: theme.colors.surfaceVariant }}>
                      {i.product_code}
                    </Text>
                    {isOutOfStock && (
                      <Text style={{ color: theme.colors.error, fontSize: 10 }}>
                        Out of Stock!
                      </Text>
                    )}
                  </View>
                  <View style={{}}>
                    <Text
                      variant="bodyMedium"
                      style={{
                        textDecorationLine: isPriceUnset
                          ? "line-through"
                          : "none",
                      }}>
                      {Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: i.currency_code,
                      }).format(i?.unit_sell_price)}
                    </Text>
                    {isPriceUnset && (
                      <Text style={{ color: theme.colors.error, fontSize: 10 }}>
                        Invalid Amount!
                      </Text>
                    )}
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
      <View style={{}}>
        <View
          style={{
            //paddingHorizontal: 15,
            flexDirection: "row",
            alignItems: "center",
          }}>
          <View
            style={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}>
            <IconButton
              icon={"chevron-left"}
              size={30}
              onPress={handleGoToPointOfSale1}
            />
            <PointOfSaleHeader theme={theme} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon={"chevron-right"}
              size={30}
              onPress={handleGoToPointOfSale3}
            />
          </View>
        </View>

        {previewList?.length < 1 && (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Text variant="bodyLarge">No Item(s) has been selected</Text>
          </View>
        )}

        {previewList?.length > 0 && (
          <ScrollView>
            {previewList?.map((i) => {
              return (
                <View
                  key={i?.product_id}
                  style={{
                    marginVertical: 5,
                    marginHorizontal: 15,
                    backgroundColor: (theme.colors as any).backgroundPaper,
                    padding: 15,
                    borderRadius: 20,
                  }}>
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
                          //fontSize: 12,
                        }}>
                        Unit of Measure: {i.unit_of_measure}
                      </Text>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}>
                      <Text variant="bodyMedium">
                        {Intl.NumberFormat("en-NG", {
                          style: "currency",
                          currency: i.currency_code,
                        }).format(i?.total_amount)}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 3,
                      backgroundColor: theme.colors.onBackground,
                      borderRadius: 50,
                    }}>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
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
        )}
      </View>
    );
  };

  const renderProductAction = () => {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}>
          <View
            style={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}>
            <IconButton
              icon={"chevron-left"}
              size={30}
              onPress={handleGoToPointOfSale2}
            />
            <PointOfSaleHeader theme={theme} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}></View>
        </View>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 15,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              padding: 15,
              backgroundColor: (theme.colors as any).backgroundPaper,
              borderRadius: 20,
            }}>
            <View>
              <TextInput
                mode="outlined"
                label="Subtotal"
                outlineColor="transparent"
                value={subtotal}
                editable={false}
                left={
                  <TextInput.Affix
                    text={renderCurrencySymbol(storeItem?.currency_code ?? "")}
                    textStyle={{ color: theme.colors.surfaceVariant }}
                  />
                }
              />
            </View>

            <View>
              <TextInput
                mode="outlined"
                label="V.A.T"
                outlineColor="transparent"
                value={vat}
                editable={false}
                left={
                  <TextInput.Affix
                    text={"%"}
                    textStyle={{ color: theme.colors.surfaceVariant }}
                  />
                }
              />
            </View>

            <View>
              <TextInput
                mode="outlined"
                label="Total + V.A.T"
                outlineColor="transparent"
                value={grandtotal}
                editable={false}
                left={
                  <TextInput.Affix
                    text={renderCurrencySymbol(storeItem?.currency_code ?? "")}
                    textStyle={{ color: theme.colors.surfaceVariant }}
                  />
                }
              />
            </View>
            <View>
              <TextInput
                mode="outlined"
                label="Balance"
                outlineColor="transparent"
                value={balance}
                editable={false}
                left={
                  <TextInput.Affix
                    text={renderCurrencySymbol(storeItem?.currency_code ?? "")}
                    textStyle={{ color: theme.colors.surfaceVariant }}
                  />
                }
              />
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              padding: 15,
              backgroundColor: (theme.colors as any).backgroundPaper,
              borderRadius: 20,
            }}>
            <View>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.primary,
                }}>
                <Picker
                  selectedValue={accountSelected}
                  onValueChange={(val, idx) => {
                    setAccountSelected(val);
                    setAccountSelectedErr("");
                  }}
                  style={{ color: theme.colors.surface }}>
                  <Picker.Item value={""} label="Select collection account" />
                  {accountList?.map((i) => (
                    <Picker.Item
                      key={i?.collection_account_id}
                      value={i?.collection_account_id}
                      label={i.account_name}
                    />
                  ))}
                </Picker>
              </View>
              {accountSelectedErr && (
                <HelperText type="error">{accountSelectedErr}</HelperText>
              )}
            </View>
            <View
              style={{
                borderWidth: 1,
                borderRadius: 5,
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.primary,
              }}>
              <Picker
                selectedValue={paymentChannel}
                onValueChange={(val, idx) => setPaymentChannel(val)}
                style={{ color: theme.colors.surface }}>
                <Picker.Item value={""} label="Select payment method" />
                {paymentChannels?.map((i) => (
                  <Picker.Item key={i?.id} value={i?.id} label={i.name} />
                ))}
              </Picker>
            </View>
            <View>
              <TextInput
                mode="outlined"
                label="Discount Amount"
                value={discountAmount}
                onChangeText={(val) => setDiscountAmount(val)}
                left={
                  <TextInput.Affix
                    text={renderCurrencySymbol(storeItem?.currency_code ?? "")}
                    textStyle={{ color: theme.colors.surfaceVariant }}
                  />
                }
              />
            </View>
            <View>
              <TextInput
                mode="outlined"
                label="Paid Amount"
                value={paidAmount}
                onChangeText={(val) => setPaidAmount(val)}
                onTouchStart={() => setPaidAmountErr("")}
                left={
                  <TextInput.Affix
                    text={renderCurrencySymbol(storeItem?.currency_code ?? "")}
                    textStyle={{ color: theme.colors.surfaceVariant }}
                  />
                }
              />
              {paidAmountErr && (
                <HelperText type="error">{paidAmountErr}</HelperText>
              )}
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
            }}>
            <TouchableOpacity
              style={{
                aspectRatio: "1/1",
                borderRadius: 10,
                flex: 1,
                justifyContent: "center",
                backgroundColor: (theme.colors as any).warning,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#fff",
                  textAlign: "center",
                }}>
                Hold
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                aspectRatio: "1/1",
                borderRadius: 10,
                flex: 1,
                justifyContent: "center",
                backgroundColor: (theme.colors as any).error,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#fff",
                  textAlign: "center",
                }}>
                Clear
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                aspectRatio: 1, // you can also use 1 instead of "1/1"
                borderRadius: 10,
                flex: 1,
                justifyContent: "center",
                alignItems: "center", // centers content horizontally
                backgroundColor: (theme.colors as any).success,
              }}
              onPress={() => {
                if (settingStore.biometricSale) {
                  handleBiometricLogin();
                } else {
                  handleConfirmSales();
                }
              }}
              disabled={saving}>
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#fff",
                    textAlign: "center",
                  }}>
                  Confirm
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {handleRenderContent()}

      {bottomSheetOpen && (
        <Modal
          isVisible={bottomSheetOpen}
          onBackdropPress={openBottomSheet} // tap outside to close
          onSwipeComplete={closeBottomSheet} // swipe down to close
          swipeDirection="down"
          style={{ justifyContent: "flex-end", margin: 0 }}>
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}>
            <Text
              //variant="headlineSmall"
              style={{
                fontWeight: 700,
                textAlign: "center",
                padding: 10,
                color: theme.colors.surfaceVariant,
                fontSize: 20,
              }}>
              Sales Receipt
            </Text>
            <View
              ref={receiptRef}
              style={{
                width: "100%",
                height: 550,
                backgroundColor: "white",
                overflow: "hidden",
              }}>
              <WebView
                source={{ html: receipt }}
                style={{ flex: 1, backgroundColor: "white" }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
              }}>
              <Button
                mode="outlined"
                style={{ flex: 1 }}
                icon={() => (
                  <IconButton
                    icon="image"
                    size={20}
                    style={{ margin: -5 }}
                    iconColor={(theme.colors as any).info}
                  />
                )}
                onPress={handleShareReceiptAsImage}>
                Share as Image
              </Button>

              <Button
                mode="outlined"
                style={{ flex: 1 }}
                icon={() => (
                  <IconButton
                    icon="file-pdf-box"
                    size={20}
                    style={{ margin: -5 }}
                    iconColor={theme.colors.error}
                  />
                )}
                onPress={handleShareReceiptAsPDF}>
                Share as PDF
              </Button>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
