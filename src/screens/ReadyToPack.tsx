import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  Alert,
  AlertTitle,
  AppBar,
  Badge,
  Box,
  Button,
  ButtonBase,
  Checkbox,
  Collapse,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputBase,
  InputLabel,
  Link,
  ListItemIcon,
  ListSubheader,
  Menu,
  MenuItem,
  Paper,
  Popover,
  Radio,
  RadioGroup,
  Select,
  type SelectChangeEvent,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha, keyframes, useTheme, type Theme } from "@mui/material/styles";
import { indigo, lightBlue, orange, pink, purple, red } from "@mui/material/colors";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import CardGiftcardOutlinedIcon from "@mui/icons-material/CardGiftcardOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import ScreenshotMonitorIcon from "@mui/icons-material/ScreenshotMonitor";
import LaptopIcon from "@mui/icons-material/Laptop";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import NumbersIcon from "@mui/icons-material/Numbers";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SyncIcon from "@mui/icons-material/Sync";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import AddIcon from "@mui/icons-material/Add";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

import { LinkedShipmentTabs, type LinkedShipmentTabItem } from "../components/LinkedShipmentTabs";
import { loadNewSplitShipmentIdFromApi } from "../api/loadNewSplitShipmentId";
import {
  getPackingStatusChipConfig,
  isPackingStatusBlockingActions,
  type PackingOrderUiStatus,
} from "../packing/statusChipConfig";
import {
  CURRENT_PACKING_FACILITY_ID,
  RECOVERY_COUNTRY_OPTIONS,
  RECOVERY_MATERIAL_OPTIONS,
  findCountryName,
  formatCarrierServiceDisplay,
  getHsCodeForMaterial,
  getScenarioBarcode,
} from "../recovery/recoveryFixtures";
import type {
  CarrierServiceOption,
  CountryAddressRules,
  FacilityConfig,
  ManualShipmentDraft,
  ManualShipmentItemDraft,
  RecoveryScenario,
  TgSupplierItemRecord,
} from "../recovery/recoveryTypes";
import {
  lookupTgSupplierItemFromApi,
  markItemSentInTgSupplierFromApi,
} from "../services/tgSupplier";
import {
  ShipmentGenerationError,
  createManualShipmentFromApi,
  triggerShipmentGenerationFromApi,
} from "../services/shipmentGeneration";
import { loadCountryAddressRulesFromApi } from "../services/localization";
import { loadCarrierServicesFromApi, loadFacilityConfigFromApi } from "../services/logistics";
import oakAndLunaLogo from "../assets/oakandluna.svg";
import logoMYKA from "../assets/logos/Logo=MYKA.svg";
import logoLAL from "../assets/logos/Logo=LAL.svg";
import logoIB from "../assets/logos/Logo=IB.svg";
import logoMNNCA from "../assets/logos/Logo=MNN-CA.svg";
import logoForeverMY from "../assets/logos/Logo=ForeverMY.svg";
import logoTheoGrace from "../assets/logos/Logo=theo grace.svg";
import logoSETT from "../assets/logos/Logo=SETT.svg";
import logoTGSeller from "../assets/logos/Logo=TGSeller.svg";
import { useLayout } from "../context/LayoutContext";

/** Prototype-only: brand logos cycled by clicking the header logo. */
const PROTOTYPE_BRAND_LOGOS: { src: string; alt: string }[] = [
  { src: oakAndLunaLogo, alt: "Oak & Luna" },
  { src: logoMYKA, alt: "MYKA" },
  { src: logoLAL, alt: "Live and Let" },
  { src: logoIB, alt: "IB" },
  { src: logoMNNCA, alt: "MNN CA" },
  { src: logoForeverMY, alt: "Forever MY" },
  { src: logoTheoGrace, alt: "Theo Grace" },
  { src: logoSETT, alt: "SETT" },
  { src: logoTGSeller, alt: "TG Seller" },
];
import product1Img from "../assets/products/product-1.png";
import product2Img from "../assets/products/product-2.png";
import product3Img from "../assets/products/product-3.png";
import product4Img from "../assets/products/Product-4.png";
import product5Img from "../assets/products/Product-5.png";
import boxMediumImg from "../assets/products/box-medium.png";
import boxSmallImg from "../assets/products/box-small.png";

const MORE_ACTIONS_MENU_ITEMS_DEFAULT = [
  { id: "reprint-giftcard", label: "Reprint Giftcard", Icon: CardGiftcardOutlinedIcon },
  { id: "reprint-packing-label", label: "Reprint Packing Label", Icon: LocalPrintshopOutlinedIcon },
  { id: "join-shipment", label: "Join Shipment", Icon: MergeTypeIcon },
  { id: "split-shipment", label: "Split Shipment", Icon: CallSplitIcon },
] as const;

const MORE_ACTIONS_MENU_ITEMS_PACKED = [
  { id: "unpack-shipment", label: "Unpack Shipment", Icon: ShoppingBagOutlinedIcon },
  { id: "reprint-giftcard", label: "Reprint Giftcard", Icon: CardGiftcardOutlinedIcon },
  { id: "reprint-packing-label", label: "Reprint Packing Label", Icon: LocalPrintshopOutlinedIcon },
] as const;

/** Muted outlined dismiss actions in modals (secondary tone; not primary black/blue). */
const DIALOG_CANCEL_BUTTON_SX = {
  textTransform: "none" as const,
  color: "text.secondary",
  borderColor: "divider",
  "&:hover": {
    color: "text.secondary",
    borderColor: "action.active",
    bgcolor: "action.hover",
  },
};

/** Shared modal header row: padding, title, and close control for every dialog. */
const STANDARD_DIALOG_TITLE_ROOT_SX = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 1,
  pt: 2,
  pb: 2,
  pl: 3,
  pr: 0,
  flexShrink: 0,
  boxSizing: "border-box",
} as const;

const STANDARD_DIALOG_TITLE_TEXT_SX = {
  color: "text.primary",
  fontWeight: 600,
  fontSize: 16,
  lineHeight: 1.5,
  letterSpacing: "0.15px",
} as const;

const STANDARD_DIALOG_CLOSE_ICON_SX = {
  color: "text.secondary",
  flexShrink: 0,
  mt: 0,
  marginRight: "16px",
} as const;

function StandardDialogTitle({
  children,
  onClose,
  subtitle,
}: {
  children: ReactNode;
  onClose: () => void;
  subtitle?: ReactNode;
}) {
  return (
    <DialogTitle component="div" sx={STANDARD_DIALOG_TITLE_ROOT_SX}>
      <Box sx={{ flex: "1 1 auto", minWidth: 0 }}>
        <Typography variant="subtitle1" component="h2" sx={STANDARD_DIALOG_TITLE_TEXT_SX}>
          {children}
        </Typography>
        {subtitle ? <Box sx={{ mt: 0.5 }}>{subtitle}</Box> : null}
      </Box>
      <IconButton
        aria-label="Close"
        onClick={onClose}
        size="small"
        sx={STANDARD_DIALOG_CLOSE_ICON_SX}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
}

const IMG = {
  item1: product1Img,
  boxMedium: boxMediumImg,
  item2: product2Img,
  boxSmall: boxSmallImg,
  item3: product3Img,
} as const;

type JoinTransferItem = {
  id: string;
  title: string;
  image: string;
  /** Items from the external shipment can move between columns. */
  movable: boolean;
  /** Multi-source join: return Move on current column to this shipment. */
  returnToSourceShipmentId?: string;
};

type JoinSourceShipmentColumn = {
  shipmentId: string;
  items: JoinTransferItem[];
};

/** Shared line copy for Product-4 asset (split secondary tab + join source column). */
const PRODUCT_4_LINE_TITLE = "Serena Bow Initial Necklace with Birthstone in Gold Vermiel";

const JOIN_SOURCE_SEED: JoinTransferItem[] = [
  {
    id: "join-ext-1",
    title: PRODUCT_4_LINE_TITLE,
    image: product4Img,
    movable: true,
  },
  {
    id: "join-ext-2",
    title: "Grace Interlocking Bracelet in Sterling Silver",
    image: product5Img,
    movable: true,
  },
];

const JOIN_CURRENT_SEED: JoinTransferItem[] = [
  {
    id: "pack-item-1",
    title: "Engraved Compass Necklace - Gold Vermeil",
    image: IMG.item1,
    movable: false,
  },
  {
    id: "pack-item-2",
    title: "Grace Interlocking Necklace with Diamond in 18K Gold Vermeil",
    image: IMG.item2,
    movable: false,
  },
  {
    id: "pack-item-3",
    title: "Premium Gift Kit",
    image: IMG.item3,
    movable: false,
  },
];

function joinLayoutKey(source: JoinTransferItem[], current: JoinTransferItem[]) {
  return `${source.map((i) => i.id).join(",")}|${current.map((i) => i.id).join(",")}`;
}

function joinMultiSourceLayoutKey(sources: JoinSourceShipmentColumn[], current: JoinTransferItem[]) {
  const left = sources
    .map((s) => `${s.shipmentId}:${s.items.map((i) => i.id).join(",")}`)
    .join(";");
  return `${left}|${current.map((i) => i.id).join(",")}`;
}

const elevationSx = {
  boxShadow:
    "0px 1px 3px 0px rgba(0,0,0,0.12), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 2px 1px 0px rgba(0,0,0,0.2)",
};

/** Short “pop” on the main Pack CTA when an order transitions to packed (Pack click or Fallback manual pack). */
const packSuccessPop = keyframes`
  0% {
    transform: scale(1);
  }
  38% {
    transform: scale(1.06);
  }
  68% {
    transform: scale(0.97);
  }
  100% {
    transform: scale(1);
  }
`;

const ORDER_SEARCH_PLACEHOLDER = "Scan barcode or search by order/shipment ID";
/** Demo search shortcuts (help menu in search bar); values match `normalizeOrderIdForLoad`. */
const PROTOTYPE_SEARCH_KEYWORDS = [
  "pack",
  "instruction-item-level",
  "instruction-shipment-level",
  "pending",
  "manual",
  "fallback",
  "fallback-supervisor",
  "sort",
  "robot",
  "hold",
  "hold-lastitem",
  "similar",
  "similar-multiple",
  "split",
  "packed",
  "shipped",
  "cancelled",
  "noshipments",
  "recovery",
  "recovery-otherfacility",
  "recovery-fail",
  "recovery-notgsupplier",
  "production",
] as const;

/** Prototype: full ready-to-pack UI — search `pack` or Next Order. */
const PROTOTYPE_PACK_ORDER_ID = "pack";
/** Same ready-to-pack layout as `pack`, but only the first line item is loaded and rendered. */
const PROTOTYPE_INSTRUCTION_ITEM_LEVEL_ORDER_ID = "instruction-item-level";
/** Full pack list like `pack`, with shipment-wide packing instructions between Remarks and Pack (sidebar). */
const PROTOTYPE_INSTRUCTION_SHIPMENT_LEVEL_ORDER_ID = "instruction-shipment-level";
/** Prototype: pending queue — search `pending` (legacy alias: `fix`) or Next Order. */
const PROTOTYPE_PENDING_ORDER_ID = "pending";
/** Prototype: ready-to-pack + manual tracking ID row (Next Order after `pending`, or search `manual` / `manualpack`). */
const PROTOTYPE_MANUAL_PACK_ORDER_ID = "manual";
/** Prefilled manual tracking value for the manual-pack prototype and after pending acknowledgement (enables Pack CTA). */
const PROTOTYPE_MANUAL_PACK_TRACKING_DEMO = "DEMO-TRACK-001";
/** Prototype: Pack → loading → failed carrier API (Figma 1762:35805). Search `fallback`. */
const PROTOTYPE_FALLBACK_ORDER_ID = "fallback";
/** Same prototype order as `fallback` but selects supervisor (Elena) + Kiryat Gat factory (alias: `fallback_supervisor`). Or use header toggles. */
const PROTOTYPE_FALLBACK_SUPERVISOR_SEARCH = "fallback-supervisor";
const PROTOTYPE_FALLBACK_PACK_ERROR_TITLE = "API Connection Failed";
const PROTOTYPE_FALLBACK_PACK_ERROR_DETAIL = "FEDEX_ERROR: Invalid postal code for destination";

const PROTOTYPE_SUPERVISOR_DISPLAY_NAME = "Elena Vasquez";
/** Prototype: sorting station — search `sort`; full screen without pack checkbox / pack buttons (API tracks sorting). */
const PROTOTYPE_SORT_STATION_ORDER_ID = "sort";
/** Same sorting-station UI as `sort`, but only the first line item is shown (robot pick cell). */
const PROTOTYPE_ROBOT_STATION_ORDER_ID = "robot";
/** Prototype: already packed shipment — search `packed` or Next Order. */
const PROTOTYPE_PACKED_ORDER_ID = "packed";
/** Prototype: shipped shipment — search `shipped` or Next Order. */
const PROTOTYPE_SHIPPED_ORDER_ID = "shipped";
/** Prototype: cancelled shipment — search `cancelled` or Next Order. */
const PROTOTYPE_CANCELLED_ORDER_ID = "cancelled";
/** Prototype: on hold — search `hold` (Figma 1664:19401). */
const PROTOTYPE_ON_HOLD_ORDER_ID = "hold";
/**
 * Prototype: on-hold clone of `sort` where the last physical item is up for release — search
 * `hold-lastitem`. Auto-opens the "Release shipment" modal on load.
 */
const PROTOTYPE_HOLD_LAST_ITEM_ORDER_ID = "hold-lastitem";
/** Cell the already-stored item (Engraved Compass Necklace) sits in for the `hold-lastitem` demo. */
const PROTOTYPE_HOLD_LAST_ITEM_ASSIGNED_CELL = 148;
/** Prototype: similar orders (same address) — search `similar`; tabs to switch orders (Figma 2314:30804). */
const PROTOTYPE_SIMILAR_ORDERS_ORDER_ID = "similar";
/** Same as `similar`, but join dialog lists two source shipments at once — search `similar-multiple`. */
const PROTOTYPE_SIMILAR_MULTIPLE_ORDERS_ORDER_ID = "similar-multiple";
/** Prototype: linked split shipments — search `split` or finish Split Shipment dialog; tabs for original + new. */
const PROTOTYPE_SPLIT_ORDER_ID = "split";
/** Prototype: "No shipments found" state — search `noshipments` (or an all-zeros ID). */
const PROTOTYPE_NO_SHIPMENTS_SEARCH = "noshipments";
/**
 * Prototype: shipment recovery from the not-found state. Each keyword lands on
 * "No shipments found" and auto-opens the recovery confirm dialog with one outcome:
 * `recovery` succeeds, `recovery-otherfacility` is blocked by facility, `recovery-fail`
 * fails generation (unlocking manual creation), `recovery-notgsupplier` has no record.
 */
const PROTOTYPE_RECOVERY_SEARCH_SCENARIOS: Readonly<Record<string, RecoveryScenario>> = {
  recovery: "happyPath",
  "recovery-otherfacility": "otherFacility",
  "recovery-fail": "generationFailed",
  "recovery-notgsupplier": "noTgSupplierRecord",
};
/** Prototype: shipment whose line item is still in production — search `production`. */
const PROTOTYPE_IN_PRODUCTION_ORDER_ID = "production";
/**
 * Prototype shipment-recovery permission gate. Always granted for the demo; flip to
 * `false` to preview the unpermitted state (standard not-found message, no "Item sent").
 */
const HAS_SHIPMENT_RECOVERY_PERMISSION = true;

type SimilarOrderTab = {
  key: string;
  shipmentId: string;
  orderNumber: string;
  tabLabel: string;
  factoryLabel: string;
};

type SplitOrderTabRow = LinkedShipmentTabItem & { orderNumber: string };

/** Two prototype orders sharing the same destination (join via More actions). */
const SIMILAR_ORDER_TABS: SimilarOrderTab[] = [
  {
    key: "similar-a",
    shipmentId: "SH-12345",
    orderNumber: "5847219",
    tabLabel: "Order 5847219",
    factoryLabel: "KG",
  },
  {
    key: "similar-b",
    shipmentId: "SH-92834",
    orderNumber: "5847220",
    tabLabel: "Order 5847220",
    factoryLabel: "KG",
  },
];

/** `similar-multiple`: current shipment + two similar sources (join dialog SH-92834 / SH-74513). */
const SIMILAR_MULTIPLE_ORDER_TABS: SimilarOrderTab[] = [
  ...SIMILAR_ORDER_TABS,
  {
    key: "similar-c",
    shipmentId: "SH-74513",
    orderNumber: "5847221",
    tabLabel: "Order 5847221",
    factoryLabel: "KG",
  },
];

/** Default linked shipments when opening the split prototype via search `split`. */
const SPLIT_ORDER_PROTOTYPE_TABS: SplitOrderTabRow[] = [
  {
    key: "split-proto-a",
    shipmentId: "SH-12345",
    factoryLabel: "KG",
    orderNumber: "5847219",
  },
  {
    key: "split-proto-b",
    shipmentId: "SH-92834",
    factoryLabel: "KG",
    orderNumber: "5847220",
  },
];

/** Secondary tab (SH-92834) in default `split` search: single line matching product-4 / join seed item. */
const SPLIT_PROTOTYPE_SECOND_TAB_ITEM: JoinTransferItem = {
  id: "split-proto-product-4",
  title: PRODUCT_4_LINE_TITLE,
  image: product4Img,
  movable: false,
};

/** Second similar-order tab (SH-92834): only the differing line vs tab 0. */
const SIMILAR_ORDER_SECOND_TAB_ITEM: JoinTransferItem = {
  id: "similar-order-product-4",
  title: PRODUCT_4_LINE_TITLE,
  image: product4Img,
  movable: false,
};

/** Third `similar-multiple` tab (SH-74513): same line as join dialog source. */
const SIMILAR_MULTIPLE_THIRD_TAB_ITEM: JoinTransferItem = {
  id: "join-ext-sh74513-1",
  title: PRODUCT_4_LINE_TITLE,
  image: product4Img,
  movable: false,
};

/** `similar-multiple` join dialog: both non-current similar shipments on the left. */
const SIMILAR_MULTIPLE_JOIN_SOURCE_SHIPMENTS: JoinSourceShipmentColumn[] = [
  {
    shipmentId: "SH-92834",
    items: JOIN_SOURCE_SEED.map((x) => ({ ...x })),
  },
  {
    shipmentId: "SH-74513",
    items: [
      {
        id: "join-ext-sh74513-1",
        title: PRODUCT_4_LINE_TITLE,
        image: product4Img,
        movable: true,
      },
    ],
  },
];

/** `SIMILAR_ORDER_TABS` index for the shipment currently being packed (default selected tab). */
const SIMILAR_ORDER_CURRENT_SHIPMENT_TAB_INDEX = 0;

/** Shown in pending alert + shipment pending modal “reason for fix” (prototype). */
const PROTOTYPE_PENDING_SENT_TO_FIX_BODY = "Chain was broken and one charm was missing";
/** Status card detail under “Order status details” for cancelled (Figma 1544:6488). */
const PROTOTYPE_CANCELLED_STATUS_BODY =
  "This shipment was cancelled. Do not pack or ship. Contact CSR if you need more information.";
/** On-hold status banner under Status row (Figma 2052:23611). */
const ON_HOLD_AWAITING_ITEM_BODY = "This shipment is awaiting 1 item from Nazareth.";

/** Why a shipment is on hold — drives the description sentence in the Assign storage modal. */
type HoldReasonState = "csr_hold" | "awaiting_items" | "manual_hold";

/**
 * PROTOTYPE ONLY — flips on a small floating switcher to preview the three hold-reason
 * messages live. Set to false (or delete the guarded block) before shipping.
 */
const SHOW_HOLD_STATE_PREVIEW = true;
const HOLD_STATE_PREVIEW_OPTIONS: { value: HoldReasonState; label: string }[] = [
  { value: "csr_hold", label: "CSR hold" },
  { value: "awaiting_items", label: "Awaiting items" },
  { value: "manual_hold", label: "Manual hold" },
];

/** Hold-reason description sentence shown as the Assign storage modal subtitle. */
function formatHoldReasonMessage(
  state: HoldReasonState,
  awaitingCount: number,
  facilityName: string,
): string {
  if (state === "csr_hold") return "This shipment is on hold by CSR.";
  if (state === "awaiting_items") {
    const itemNoun = awaitingCount === 1 ? "item" : "items";
    return `This shipment is awaiting ${awaitingCount} ${itemNoun} from ${facilityName}.`;
  }
  return "This shipment has been manually placed on hold.";
}

/** One storage location shown as a card in the "Release shipment" modal. */
type ReleaseLocationCardData = { kind: "cell" | "container"; value: string; itemCount: number };

/** Recommended example: all items in one cell. */
const RELEASE_EXAMPLE_SINGLE: ReleaseLocationCardData[] = [{ kind: "cell", value: "148", itemCount: 2 }];
/** Multi-location example: items split across a cell and a container. */
const RELEASE_EXAMPLE_MULTI: ReleaseLocationCardData[] = [
  { kind: "cell", value: "148", itemCount: 2 },
  { kind: "container", value: "234q3432", itemCount: 1 },
];
/** Next Order (prototype): sort → hold → pack → pending → manual → fallback → similar → split → packed → cancelled → (loops to sort). */
const PROTOTYPE_NEXT_ORDER_CYCLE = [
  PROTOTYPE_SORT_STATION_ORDER_ID,
  PROTOTYPE_ON_HOLD_ORDER_ID,
  PROTOTYPE_PACK_ORDER_ID,
  PROTOTYPE_PENDING_ORDER_ID,
  PROTOTYPE_MANUAL_PACK_ORDER_ID,
  PROTOTYPE_FALLBACK_ORDER_ID,
  PROTOTYPE_SIMILAR_ORDERS_ORDER_ID,
  PROTOTYPE_SIMILAR_MULTIPLE_ORDERS_ORDER_ID,
  PROTOTYPE_SPLIT_ORDER_ID,
  PROTOTYPE_PACKED_ORDER_ID,
  PROTOTYPE_SHIPPED_ORDER_ID,
  PROTOTYPE_CANCELLED_ORDER_ID,
] as const;

function isPrototypePendingOrderId(id: string | null): boolean {
  return id !== null && id.toLowerCase() === PROTOTYPE_PENDING_ORDER_ID;
}

function isPrototypeManualPackOrderId(id: string | null): boolean {
  return id !== null && id.toLowerCase() === PROTOTYPE_MANUAL_PACK_ORDER_ID;
}

function isPrototypeFallbackOrderId(id: string | null): boolean {
  return id !== null && id.toLowerCase() === PROTOTYPE_FALLBACK_ORDER_ID;
}

function isSortingStationOrderId(id: string | null): boolean {
  return id !== null && id.toLowerCase() === PROTOTYPE_SORT_STATION_ORDER_ID;
}

function isRobotStationOrderId(id: string | null): boolean {
  return id !== null && id.toLowerCase() === PROTOTYPE_ROBOT_STATION_ORDER_ID;
}

function isPrototypeCancelledOrderId(id: string | null): boolean {
  return id !== null && id.toLowerCase() === PROTOTYPE_CANCELLED_ORDER_ID;
}

function isPrototypeOnHoldOrderId(id: string | null): boolean {
  return id !== null && id.toLowerCase() === PROTOTYPE_ON_HOLD_ORDER_ID;
}

function isPrototypeHoldLastItemOrderId(id: string | null): boolean {
  return id !== null && id.toLowerCase() === PROTOTYPE_HOLD_LAST_ITEM_ORDER_ID;
}

function isPrototypeSimilarOrdersId(id: string | null): boolean {
  return id !== null && id.toLowerCase() === PROTOTYPE_SIMILAR_ORDERS_ORDER_ID;
}

function isPrototypeSimilarMultipleOrdersId(id: string | null): boolean {
  return id !== null && id.toLowerCase() === PROTOTYPE_SIMILAR_MULTIPLE_ORDERS_ORDER_ID;
}

function isPrototypeSimilarLinkedOrdersId(id: string | null): boolean {
  return isPrototypeSimilarOrdersId(id) || isPrototypeSimilarMultipleOrdersId(id);
}

function isPrototypeSplitOrdersId(id: string | null): boolean {
  return id !== null && id.toLowerCase() === PROTOTYPE_SPLIT_ORDER_ID;
}

function isPrototypePackedOrderId(id: string | null): boolean {
  return id !== null && id.toLowerCase() === PROTOTYPE_PACKED_ORDER_ID;
}

function isPrototypeShippedOrderId(id: string | null): boolean {
  return id !== null && id.toLowerCase() === PROTOTYPE_SHIPPED_ORDER_ID;
}

function isPrototypeInstructionItemLevelOrderId(id: string | null): boolean {
  return id !== null && id.toLowerCase() === PROTOTYPE_INSTRUCTION_ITEM_LEVEL_ORDER_ID;
}

function isPrototypeInstructionShipmentLevelOrderId(id: string | null): boolean {
  return id !== null && id.toLowerCase() === PROTOTYPE_INSTRUCTION_SHIPMENT_LEVEL_ORDER_ID;
}

function isPrototypeInProductionOrderId(id: string | null): boolean {
  return id !== null && id.toLowerCase() === PROTOTYPE_IN_PRODUCTION_ORDER_ID;
}

/** Maps a recovery demo keyword to the outcome it simulates; null for any other query. */
function resolveRecoveryScenario(query: string): RecoveryScenario | null {
  return PROTOTYPE_RECOVERY_SEARCH_SCENARIOS[query.trim().toLowerCase()] ?? null;
}

function getNextPrototypeCycleOrderId(current: string | null): string {
  const order = PROTOTYPE_NEXT_ORDER_CYCLE;
  if (!current) return order[0];
  const normalized =
    current.toLowerCase() === PROTOTYPE_INSTRUCTION_ITEM_LEVEL_ORDER_ID ||
    current.toLowerCase() === PROTOTYPE_INSTRUCTION_SHIPMENT_LEVEL_ORDER_ID
      ? PROTOTYPE_PACK_ORDER_ID
      : current.toLowerCase() === PROTOTYPE_ROBOT_STATION_ORDER_ID
        ? PROTOTYPE_SORT_STATION_ORDER_ID
        : current;
  const i = order.findIndex((id) => id.toLowerCase() === normalized.toLowerCase());
  if (i < 0) return order[0];
  return order[(i + 1) % order.length];
}

/** Allows demo searches like `# fallback-supervisor` in the bar. */
function stripLeadingHashSearchPrefix(raw: string): string {
  return raw.trim().replace(/^#+\s*/, "").trim();
}

function normalizeOrderIdForLoad(raw: string): string {
  const t = stripLeadingHashSearchPrefix(raw);
  const lower = t.toLowerCase();
  if (lower === PROTOTYPE_PACK_ORDER_ID) return PROTOTYPE_PACK_ORDER_ID;
  if (lower === PROTOTYPE_INSTRUCTION_ITEM_LEVEL_ORDER_ID || lower === "instruction_item_level") {
    return PROTOTYPE_INSTRUCTION_ITEM_LEVEL_ORDER_ID;
  }
  if (lower === PROTOTYPE_INSTRUCTION_SHIPMENT_LEVEL_ORDER_ID || lower === "instruction_shipment_level") {
    return PROTOTYPE_INSTRUCTION_SHIPMENT_LEVEL_ORDER_ID;
  }
  if (lower === PROTOTYPE_PENDING_ORDER_ID || lower === "fix") return PROTOTYPE_PENDING_ORDER_ID;
  if (lower === PROTOTYPE_MANUAL_PACK_ORDER_ID || lower === "manualpack" || lower === "manual-pack")
    return PROTOTYPE_MANUAL_PACK_ORDER_ID;
  if (
    lower === PROTOTYPE_FALLBACK_ORDER_ID ||
    lower === PROTOTYPE_FALLBACK_SUPERVISOR_SEARCH ||
    lower === "fallback_supervisor"
  )
    return PROTOTYPE_FALLBACK_ORDER_ID;
  if (lower === PROTOTYPE_SORT_STATION_ORDER_ID) return PROTOTYPE_SORT_STATION_ORDER_ID;
  if (lower === PROTOTYPE_ROBOT_STATION_ORDER_ID) return PROTOTYPE_ROBOT_STATION_ORDER_ID;
  if (lower === PROTOTYPE_PACKED_ORDER_ID) return PROTOTYPE_PACKED_ORDER_ID;
  if (lower === PROTOTYPE_SHIPPED_ORDER_ID) return PROTOTYPE_SHIPPED_ORDER_ID;
  if (lower === PROTOTYPE_CANCELLED_ORDER_ID) return PROTOTYPE_CANCELLED_ORDER_ID;
  if (lower === PROTOTYPE_HOLD_LAST_ITEM_ORDER_ID || lower === "hold_lastitem")
    return PROTOTYPE_HOLD_LAST_ITEM_ORDER_ID;
  if (lower === PROTOTYPE_ON_HOLD_ORDER_ID) return PROTOTYPE_ON_HOLD_ORDER_ID;
  if (lower === PROTOTYPE_SIMILAR_ORDERS_ORDER_ID) return PROTOTYPE_SIMILAR_ORDERS_ORDER_ID;
  if (lower === PROTOTYPE_SIMILAR_MULTIPLE_ORDERS_ORDER_ID) return PROTOTYPE_SIMILAR_MULTIPLE_ORDERS_ORDER_ID;
  if (lower === PROTOTYPE_SPLIT_ORDER_ID) return PROTOTYPE_SPLIT_ORDER_ID;
  if (lower === PROTOTYPE_IN_PRODUCTION_ORDER_ID) return PROTOTYPE_IN_PRODUCTION_ORDER_ID;
  return t;
}

function normalizeSplitNewShipmentIdForTab(id: string | null): string {
  if (id == null || !String(id).trim()) return "SH-92834";
  const t = String(id).trim();
  if (t.startsWith("SH-")) return t;
  if (/^\d+$/.test(t)) return `SH-${t}`;
  return t;
}

function prototypeSplitOriginalShipmentIdForTabs(currentShipmentId: string): string {
  const t = currentShipmentId.trim();
  if (
    !t ||
    t === PROTOTYPE_PACK_ORDER_ID ||
    t === PROTOTYPE_INSTRUCTION_ITEM_LEVEL_ORDER_ID ||
    t === PROTOTYPE_INSTRUCTION_SHIPMENT_LEVEL_ORDER_ID ||
    t === PROTOTYPE_MANUAL_PACK_ORDER_ID ||
    t === PROTOTYPE_FALLBACK_ORDER_ID ||
    t === PROTOTYPE_SORT_STATION_ORDER_ID ||
    t === PROTOTYPE_ROBOT_STATION_ORDER_ID
  )
    return "SH-12345";
  if (t.startsWith("SH-")) return t;
  return "SH-12345";
}

function isNoShipmentsQuery(id: string): boolean {
  if (!id.length) return false;
  if (resolveRecoveryScenario(id) !== null) return true;
  return /^0+$/.test(id) || id.toLowerCase() === PROTOTYPE_NO_SHIPMENTS_SEARCH;
}

function EmptyStateHero() {
  return (
    <Box
      sx={{
        flex: "1 1 auto",
        alignSelf: "stretch",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: 0,
        py: 4,
      }}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 400,
          height: 400,
          borderRadius: "50%",
          bgcolor: "background.paper",
          gap: 4.25,
          textAlign: "center",
          px: 3,
          boxSizing: "border-box",
        }}
      >
        <DocumentScannerOutlinedIcon sx={{ fontSize: 64, color: "action.active" }} />
        <Stack spacing={1} alignItems="center" sx={{ color: "text.primary" }}>
          <Typography
            sx={{
              fontSize: 24.29,
              lineHeight: 1.235,
              letterSpacing: "0.1786px",
              fontWeight: 400,
            }}
          >
            Scan a barcode
          </Typography>
          <Typography
            sx={{
              fontSize: 17.14,
              lineHeight: 1.334,
              letterSpacing: "0.15px",
              fontWeight: 400,
              maxWidth: 320,
            }}
          >
            or enter an order/shipment ID
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

function NoShipmentsFoundHero({
  shippingId,
  action,
}: {
  shippingId: string;
  /** Recovery entry point, rendered under the subtext (tightens the icon/text gap when present). */
  action?: ReactNode;
}) {
  return (
    <Box
      sx={{
        flex: "1 1 auto",
        alignSelf: "stretch",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        minHeight: 0,
        py: 4,
      }}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          width: 400,
          height: 400,
          borderRadius: "50%",
          bgcolor: "background.paper",
          gap: action ? 3 : 4.25,
          textAlign: "center",
          px: 3,
          boxSizing: "border-box",
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 64, color: "action.active" }} />
        <Stack spacing={1} alignItems="center" sx={{ color: "text.primary", maxWidth: 340 }}>
          <Typography
            sx={{
              fontSize: 24.29,
              lineHeight: 1.235,
              letterSpacing: "0.1786px",
              fontWeight: 400,
            }}
          >
            No shipments found
          </Typography>
          <Typography
            sx={{
              fontSize: 17.14,
              lineHeight: 1.334,
              letterSpacing: "0.15px",
              fontWeight: 400,
              wordBreak: "break-all",
            }}
          >
            for shipping ID #{shippingId}
          </Typography>
        </Stack>
        {action}
      </Stack>
    </Box>
  );
}

function DetailLabel({ children, sx }: { children: ReactNode; sx?: object }) {
  return (
    <Typography variant="body1" fontWeight={500} color="#212121" letterSpacing="0.15px" sx={sx}>
      {children}
    </Typography>
  );
}

function DetailValue({ children }: { children: ReactNode }) {
  return (
    <Typography variant="body1" color="text.primary" letterSpacing="0.15px">
      {children}
    </Typography>
  );
}

function FieldBlock({
  label,
  children,
  minWidth,
  align = "left",
}: {
  label: string;
  children: ReactNode;
  minWidth?: number;
  align?: "left" | "right";
}) {
  return (
    <Stack
      spacing={0.5}
      sx={{
        minWidth: minWidth ?? "auto",
        alignItems: align === "right" ? "flex-end" : "flex-start",
        textAlign: align === "right" ? "right" : "left",
      }}
    >
      <DetailLabel sx={align === "right" ? { textAlign: "right", width: "100%" } : undefined}>{label}</DetailLabel>
      {children}
    </Stack>
  );
}

/** Action link row below shipment field value (unlock-edit mode). */
function ShipmentFieldActionLink({
  children,
  onClick,
  disabledReason,
}: {
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  disabledReason?: string;
}) {
  const link = (
    <Link
      href="#"
      onClick={(e) => {
        e.preventDefault();
        if (!disabledReason) onClick?.(e);
      }}
      underline={disabledReason ? "none" : "hover"}
      aria-disabled={disabledReason ? true : undefined}
      sx={{
        typography: "body1",
        fontWeight: 400,
        letterSpacing: "0.15px",
        cursor: disabledReason ? "default" : "pointer",
        alignSelf: "flex-start",
        color: disabledReason ? "text.disabled" : "primary.dark",
        pointerEvents: disabledReason ? "none" : undefined,
      }}
    >
      {children}
    </Link>
  );

  if (disabledReason) {
    return (
      <Tooltip title={disabledReason}>
        <Box component="span" sx={{ display: "inline-flex", alignSelf: "flex-start" }}>
          {link}
        </Box>
      </Tooltip>
    );
  }

  return link;
}

/** Action link row: collapsed in locked view; smooth height expand when unlocked (grid columns unchanged). */
function ShipmentFieldActionArea({
  visible,
  children,
}: {
  visible: boolean;
  children: ReactNode;
}) {
  return (
    <Collapse
      in={visible}
      collapsedSize={0}
      timeout="auto"
      sx={{
        width: "100%",
        alignSelf: "stretch",
        "& .MuiCollapse-wrapper": { width: "100%" },
        "& .MuiCollapse-wrapperInner": { width: "100%" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          minHeight: 28,
          width: "100%",
        }}
      >
        {children}
      </Box>
    </Collapse>
  );
}

function SectionOverline({ children }: { children: ReactNode }) {
  return (
    <Typography
      variant="caption"
      fontWeight={600}
      letterSpacing="1px"
      textTransform="uppercase"
      sx={{ fontSize: 12, lineHeight: "32px", color: "text.primary" }}
    >
      {children}
    </Typography>
  );
}

/** Prototype copy for the packing-instructions card (ItemBlock “Instructions” column). */
const PROTOTYPE_PACKING_INSTRUCTIONS_MEDIUM =
  "This is a longer description to tell the packer this is over $100 and to pack this specific item in this box.";
const PROTOTYPE_PACKING_INSTRUCTIONS_SMALL =
  "Pack this item in the Small box. Secure the chain in the compartment before sealing.";

/**
 * A single packing instruction. `text` and `image` are independent per instruction —
 * an instruction can be text-only, image-only, or both, regardless of what the
 * others in its list carry. Only entries with neither are dropped.
 */
type PackingInstruction = { text: string; image?: string };

/**
 * Shapes accepted for the `instructions` prop: the canonical array, a single
 * instruction object, or a legacy single object using the old `bodyText`/
 * `imageSrc` field names. Everything is normalized on read for backward compat.
 */
type PackingInstructionInput =
  | { text?: string; image?: string; bodyText?: string; imageSrc?: string }
  | PackingInstruction;

/** Normalize any accepted instruction input into a clean array; drops empties. */
function normalizeInstructions(
  input: PackingInstructionInput | PackingInstructionInput[] | null | undefined,
): PackingInstruction[] {
  if (!input) return [];
  const arr = Array.isArray(input) ? input : [input];
  return arr
    .map((entry) => {
      const raw = entry as { text?: string; image?: string; bodyText?: string; imageSrc?: string };
      const text = (raw.text ?? raw.bodyText ?? "").toString().trim();
      const image = raw.image ?? raw.imageSrc ?? undefined;
      return { text, image: image || undefined };
    })
    .filter((entry) => entry.text.length > 0 || Boolean(entry.image));
}

/** Prototype: a shipment with 3 instructions — mix of text+image and text-only. */
const PROTOTYPE_SHIPMENT_INSTRUCTIONS: PackingInstruction[] = [
  { text: PROTOTYPE_PACKING_INSTRUCTIONS_MEDIUM, image: IMG.boxMedium },
  { text: "Customer requested no branded packaging — use a plain box and omit all marketing inserts." },
  { text: "Include the handwritten gift note and place it on top before sealing the box.", image: IMG.boxSmall },
];

/** Prototype: the single-instruction variant, for the shipment-level tap-to-swap demo. */
const PROTOTYPE_SHIPMENT_INSTRUCTIONS_SINGLE: PackingInstruction[] = [
  { text: PROTOTYPE_PACKING_INSTRUCTIONS_MEDIUM, image: IMG.boxMedium },
];

/** Prototype: an item with 3 instructions — text+image, then text-only, then image-only. */
const PROTOTYPE_ITEM_INSTRUCTIONS: PackingInstruction[] = [
  { text: PROTOTYPE_PACKING_INSTRUCTIONS_SMALL, image: IMG.boxSmall },
  { text: "Fragile chain — coil it loosely and add a foam wrap before boxing." },
  { text: "", image: IMG.boxMedium },
];

/** Prototype: the single-instruction variant, for the item-level tap-to-swap demo. */
const PROTOTYPE_ITEM_INSTRUCTIONS_SINGLE: PackingInstruction[] = [
  { text: PROTOTYPE_PACKING_INSTRUCTIONS_MEDIUM, image: IMG.boxMedium },
];

/** Inner padding of the instructions card — identical for the single and multiple states. */
function instructionsCardPadding(isShipment: boolean) {
  return isShipment ? 3 : 2;
}

/** Instruction image tile size — identical whether there is one instruction or several. */
const INSTRUCTION_IMAGE_SIZE = 96;

/**
 * Item-level card footprint: one fixed width for the single and multiple states so the
 * card never widens with its content and squeezes the Details column beside it.
 * (32px padding + 96px image + 24px gap leaves 262px for the instruction text.)
 */
const INSTRUCTIONS_CARD_WIDTH = 414;

/**
 * The “Packing Instructions” title band: its own row at the top of the card, always
 * closed by a full-width divider, whether there is one instruction or several. When
 * there are several, a “Multiple instructions” warning sits at the right of that row.
 */
function InstructionsCardHeader({
  count,
  isShipment,
}: {
  count: number;
  isShipment: boolean;
}) {
  return (
    <Box
      sx={{
        minWidth: 0,
        px: instructionsCardPadding(isShipment),
        py: 1.5,
        borderBottom: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "nowrap",
        columnGap: 2,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          flexShrink: 0,
          fontWeight: 600,
          letterSpacing: "0.15px",
          color: "#01579b",
          whiteSpace: "nowrap",
        }}
      >
        Packing Instructions
      </Typography>
      {count > 1 ? (
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          sx={{ flexShrink: 0, ml: "auto" }}
        >
          <WarningAmberRoundedIcon sx={{ fontSize: 18, color: "#ed6c02", flexShrink: 0 }} />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              letterSpacing: "0.15px",
              color: "#663c00",
              whiteSpace: "nowrap",
            }}
          >
            Multiple instructions
          </Typography>
        </Stack>
      ) : null}
    </Box>
  );
}

/**
 * Multiple-instruction rendering: the shared “Packing Instructions” title, then every
 * instruction fully expanded and stacked below it, separated by dividers. Nothing is
 * collapsed, truncated, paginated, or hidden behind a click. Each row's layout adapts
 * independently to whether that instruction has an image.
 */
function MultiInstructionsList({
  list,
  isShipment,
}: {
  list: PackingInstruction[];
  isShipment: boolean;
}) {
  return (
    <Box sx={{ width: "100%", minWidth: 0, boxSizing: "border-box" }}>
      <InstructionsCardHeader count={list.length} isShipment={isShipment} />

      {list.map((entry, index) => (
        <Fragment key={index}>
          {index > 0 ? <Divider /> : null}
          <Stack
            direction="row"
            spacing={2}
            alignItems="flex-start"
            justifyContent={entry.text ? undefined : "flex-end"}
            sx={{
              px: instructionsCardPadding(isShipment),
              py: 2,
              minWidth: 0,
            }}
          >
            {entry.text ? (
              <Typography
                variant="body2"
                color="text.primary"
                sx={{ flex: "1 1 auto", minWidth: 0, letterSpacing: "0.15px", lineHeight: 1.5 }}
              >
                {entry.text}
              </Typography>
            ) : null}
            {entry.image ? (
              <Box
                sx={{
                  flexShrink: 0,
                  width: INSTRUCTION_IMAGE_SIZE,
                  height: INSTRUCTION_IMAGE_SIZE,
                  bgcolor: "#eeeff1",
                  borderRadius: 0.5,
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={entry.image}
                  alt=""
                  sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </Box>
            ) : null}
          </Stack>
        </Fragment>
      ))}
    </Box>
  );
}

function ItemPackingInstructionsCard({
  instructions,
  layout = "item",
  prototypeVariants,
}: {
  instructions?: PackingInstructionInput | PackingInstructionInput[] | null | undefined;
  layout?: "item" | "shipment";
  /**
   * Prototype-only: instruction-list variants to cycle through on click
   * (e.g. [single, multiple]). Lets the prototype demo the single vs. multiple
   * states in one order without loading a different order. When provided,
   * clicking the card advances to the next variant instead of the image-only toggle.
   */
  prototypeVariants?: (PackingInstructionInput | PackingInstructionInput[])[];
}) {
  const [imageOnly, setImageOnly] = useState(false);
  const [variantIndex, setVariantIndex] = useState(0);
  const isShipment = layout === "shipment";

  const cycleEnabled = Array.isArray(prototypeVariants) && prototypeVariants.length > 1;
  const activeInstructions = cycleEnabled
    ? prototypeVariants[variantIndex % prototypeVariants.length]
    : instructions;
  const list = normalizeInstructions(activeInstructions);

  const cycleVariant = () => {
    if (!cycleEnabled) return;
    setImageOnly(false);
    setVariantIndex((i) => (i + 1) % prototypeVariants.length);
  };

  const nextList = cycleEnabled
    ? normalizeInstructions(prototypeVariants[(variantIndex + 1) % prototypeVariants.length])
    : [];
  const nextLabel = nextList.length > 1 ? `${nextList.length} instructions` : "single instruction";

  if (list.length === 0) return null;

  // More than one instruction → amber alert header + fully-expanded stacked list.
  if (list.length > 1) {
    if (isShipment) {
      return (
        <Box
          onClick={cycleEnabled ? cycleVariant : undefined}
          sx={{ cursor: cycleEnabled ? "pointer" : "default" }}
        >
          <MultiInstructionsList list={list} isShipment />
        </Box>
      );
    }
    return (
      <Paper
        variant="outlined"
        elevation={0}
        onClick={cycleEnabled ? cycleVariant : undefined}
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          borderColor: "divider",
          width: { xs: "100%", sm: INSTRUCTIONS_CARD_WIDTH },
          maxWidth: "100%",
          boxSizing: "border-box",
          cursor: cycleEnabled ? "pointer" : "default",
        }}
      >
        <MultiInstructionsList list={list} isShipment={false} />
      </Paper>
    );
  }

  // Exactly one instruction → same padded shell and same “Packing Instructions”
  // title as the multiple state, with the instruction text and its optional image
  // side by side below the title. Image-only toggle preserved.
  const { text: bodyText, image: imageSrc } = list[0];
  const hasImage = Boolean(imageSrc);
  const showImageOnly = imageOnly && hasImage;

  const toggleView = () => {
    if (hasImage) setImageOnly((v) => !v);
  };

  const imageColumn = hasImage ? (
    <Box
      sx={{
        flexShrink: 0,
        alignSelf: "center",
        display: "flex",
        width: INSTRUCTION_IMAGE_SIZE,
        height: INSTRUCTION_IMAGE_SIZE,
        bgcolor: "#eeeff1",
        borderRadius: 0.5,
        overflow: "hidden",
      }}
    >
      <Box
        component="img"
        src={imageSrc}
        alt=""
        sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
    </Box>
  ) : null;

  const singleBody = (
    <Box sx={{ width: "100%", minWidth: 0, boxSizing: "border-box" }}>
      {!showImageOnly ? <InstructionsCardHeader count={1} isShipment={isShipment} /> : null}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        alignItems="center"
        justifyContent={showImageOnly ? "center" : undefined}
        sx={{
          width: "100%",
          minWidth: 0,
          boxSizing: "border-box",
          px: instructionsCardPadding(isShipment),
          py: 2,
        }}
      >
        {!showImageOnly && bodyText ? (
          <Typography
            variant="body2"
            color="text.primary"
            sx={{
              flex: "1 1 auto",
              minWidth: 0,
              letterSpacing: "0.15px",
              lineHeight: 1.5,
            }}
          >
            {bodyText}
          </Typography>
        ) : null}
        {imageColumn}
      </Stack>
    </Box>
  );

  const toggleShellSx = {
    width: "100%",
    display: "block",
    borderRadius: isShipment ? 0 : 2,
    overflow: "hidden",
    textAlign: "left" as const,
  };

  const singleClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (cycleEnabled) cycleVariant();
    else toggleView();
  };
  const singleAriaLabel = cycleEnabled
    ? `Show ${nextLabel}`
    : showImageOnly
      ? "Show packing instructions text"
      : "Show image only";

  if (isShipment) {
    return (
      <ButtonBase
        component="div"
        onClick={singleClick}
        aria-label={singleAriaLabel}
        aria-pressed={cycleEnabled ? undefined : showImageOnly}
        focusRipple
        sx={toggleShellSx}
      >
        {singleBody}
      </ButtonBase>
    );
  }

  return (
    <ButtonBase
      component="div"
      onClick={singleClick}
      aria-label={singleAriaLabel}
      aria-pressed={cycleEnabled ? undefined : showImageOnly}
      focusRipple
      sx={{
        ...toggleShellSx,
        width: { xs: "100%", sm: INSTRUCTIONS_CARD_WIDTH },
        maxWidth: "100%",
      }}
    >
      <Paper
        variant="outlined"
        elevation={0}
        sx={{
          display: "flex",
          borderRadius: 2,
          overflow: "hidden",
          borderColor: "divider",
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          boxSizing: "border-box",
        }}
      >
        {singleBody}
      </Paper>
    </ButtonBase>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={3} alignItems="flex-start" sx={{ width: "100%", minWidth: 0 }}>
      <Typography variant="body1" color="text.secondary" sx={{ width: 120, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography
        variant="body1"
        fontWeight={500}
        color="text.primary"
        sx={{ flex: "1 1 auto", minWidth: 0, wordBreak: "break-word" }}
      >
        {value}
      </Typography>
    </Stack>
  );
}

type ShipmentMessageChannel = "packing" | "csr";
type RemarksTabValue = "all" | ShipmentMessageChannel;
type ShipmentMessageSenderRole = "packer" | "csr";

type ShipmentMessage = {
  id: string;
  at: string;
  author: string;
  senderRole: ShipmentMessageSenderRole;
  channel: ShipmentMessageChannel;
  body: string;
  itemId: string | null;
  itemLabel: string;
};

/** Newest first; stable tie-break on id. Seed `at` values must stay ≤ real session time so new sends sort to top. */
function compareShipmentMessagesNewestFirst(a: ShipmentMessage, b: ShipmentMessage): number {
  const tb = new Date(b.at).getTime();
  const ta = new Date(a.at).getTime();
  if (Number.isNaN(ta) || Number.isNaN(tb)) return 0;
  if (tb !== ta) return tb - ta;
  return b.id.localeCompare(a.id);
}

/** Shipment-level “Apply to” scope and stored `itemLabel` for all-product remarks. */
const REMARK_ALL_PRODUCTS_LABEL = "All Products";

const REMARK_PRESET_OPTIONS: string[] = [
  "Done",
  "Order waiting for similar",
  "Similar Order- Sent Separately more than 3 days",
  "Sent Back to Supplier",
  "Sent free Gift per request",
  "Sent to fix",
  "Sent to fix - 2nd time",
  "Sent to Reorder",
  "Sent Return Envelope - KG",
  "Sent Return Envelope - RG",
  "Shipping method changed - approved by CSR",
  "Shipped Reorder",
  "Shipped Refund",
  "Sent back to supplier the original item",
  "Sent only chain [requested by CSR]",
  "Sent only Stones [requested by CSR]",
  "Request address confirmation",
  "Address confirmed",
  "Address not confirmed",
  "Arrived from FIX",
  "Reshipped",
  "Sent to fix the returned item",
];

const PACK_LINE_ITEM_META: { id: string; title: string; itemListLabel: string }[] = [
  {
    id: "pack-item-1",
    title: "Engraved Compass Necklace - Gold Vermeil",
    itemListLabel: "Engraved Compass Necklace · Gold Vermeil",
  },
  {
    id: "pack-item-2",
    title: "Grace Interlocking Necklace with Diamond in 18K Gold Vermeil",
    itemListLabel: "Grace Interlocking Necklace · 18K Gold Vermeil",
  },
  {
    id: "pack-item-3",
    title: "Premium Gift Kit",
    itemListLabel: "Premium Gift Kit",
  },
];

const PACK_LINE_ITEM_IMAGES: readonly string[] = [IMG.item1, IMG.item2, IMG.item3];

function buildSplitShipmentCurrentItems(): JoinTransferItem[] {
  return PACK_LINE_ITEM_META.map((row, i) => ({
    id: row.id,
    title: row.title.replace(/^\d+\s*-\s*/, "").trim(),
    image: PACK_LINE_ITEM_IMAGES[i] ?? IMG.item1,
    movable: true,
  }));
}

/**
 * Append catalog lines missing from `packItems` (e.g. after leaving on-hold).
 * `excludeIds`: line ids that must stay out of the main list (still at another facility).
 */
function mergeMissingPackLineItems(prev: JoinTransferItem[], excludeIds: ReadonlySet<string> = new Set()): JoinTransferItem[] {
  const base = buildSplitShipmentCurrentItems().map((x) => ({ ...x, movable: false }));
  const have = new Set(prev.map((p) => p.id));
  const missing = base.filter((b) => !have.has(b.id) && !excludeIds.has(b.id));
  return missing.length ? [...prev, ...missing] : prev;
}

/** Prototype on-hold: line items physically at another site until marked received (Figma 2052:23611 / 1744:42531). */
const PROTOTYPE_ON_HOLD_REMOTE_FACILITY_ITEM_IDS: readonly string[] = ["pack-item-1"];

/** Label for the location chip on “other facilities” item cards (keyed by line item id). */
const PROTOTYPE_REMOTE_FACILITY_LOCATION_BY_ITEM_ID: Record<string, string> = {
  "pack-item-1": "Nazareth",
  "pack-item-2": "Nazareth",
  "pack-item-3": "Nazareth",
};

/** Hungary factory demo (header toggle): line 2 appears under “other facilities” without receive checkbox. */
const HUNGARY_DEMO_OTHER_FACILITY_LINE_IDS: readonly string[] = ["pack-item-2"];

/**
 * Prototype `production` search: line items still in production. Item 1 is in this
 * facility so it gets the "Item Sent" release control; item 2 is elsewhere, proving
 * the facility condition hides the control.
 */
const PROTOTYPE_IN_PRODUCTION_ITEM_IDS: readonly string[] = ["pack-item-1", "pack-item-2"];

/** Which facility each in-production item sits in; only current-facility items are releasable. */
const PROTOTYPE_IN_PRODUCTION_FACILITY_BY_ITEM_ID: Record<string, string> = {
  "pack-item-1": "IL-KG",
  "pack-item-2": "IL-NZ",
};

function getInProductionItemFacilityId(itemId: string): string {
  return PROTOTYPE_IN_PRODUCTION_FACILITY_BY_ITEM_ID[itemId] ?? "";
}

/** Assign-storage flow — how a line item is stored (a suggested cell, or a scanned container). */
type StorageAssignment =
  | { kind: "cell"; cell: number }
  | { kind: "container"; barcode: string };

/** Total cell capacity — surfaced in the "no free cell" warning copy. */
const PROTOTYPE_TOTAL_CELL_COUNT = 500;

/** System-suggested cell per line item (stands in for the attach-to-cell API's suggestion). */
const PROTOTYPE_SUGGESTED_CELL_BY_ITEM_ID: Record<string, number> = {
  "pack-item-1": 147,
  "pack-item-2": 148,
};
const PROTOTYPE_DEFAULT_SUGGESTED_CELL = 149;

/** Demo toggle for the "no free cell" state: item ids listed here get no suggested cell. */
const PROTOTYPE_NO_FREE_CELL_ITEM_IDS: readonly string[] = [];

/** Suggested cell for a line item, or null when the store reports no free cell. */
function getSuggestedCellForItem(itemId: string): number | null {
  if (PROTOTYPE_NO_FREE_CELL_ITEM_IDS.includes(itemId)) return null;
  return PROTOTYPE_SUGGESTED_CELL_BY_ITEM_ID[itemId] ?? PROTOTYPE_DEFAULT_SUGGESTED_CELL;
}

/** Uppercase pill label for an assigned line, e.g. "CELL 147" or "CONTAINER C.Y BOX 2606.KG". */
function storageAssignmentLabel(assignment: StorageAssignment): string {
  return assignment.kind === "cell"
    ? `CELL ${assignment.cell}`
    : `CONTAINER ${assignment.barcode}`;
}

/** Remarks list timestamps (reference: 12/12/2026, 3:23 AM). */
function formatRemarkRowDisplayTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/** Product name only in remark chips (strips leading "1 — ", "2 - ", etc.). */
function remarkItemChipLabel(itemLabel: string): string {
  if (itemLabel === REMARK_ALL_PRODUCTS_LABEL) return itemLabel;
  return itemLabel.replace(/^\d+\s*[—–\-]\s*/u, "").trim();
}

/** Product line in remarks (middle dot → hyphen to match reference copy). */
function remarkProductDisplayLine(itemLabel: string): string {
  if (itemLabel === REMARK_ALL_PRODUCTS_LABEL) return itemLabel;
  return remarkItemChipLabel(itemLabel).replace(/\s*·\s*/g, " - ");
}

function buildInitialShipmentMessages(): ShipmentMessage[] {
  return [
    {
      id: "seed-1",
      at: "2024-12-23T16:16:00.000Z",
      author: "Francisco.z",
      senderRole: "packer",
      channel: "packing",
      body: "Ok to ship",
      itemId: "pack-item-1",
      itemLabel: PACK_LINE_ITEM_META[0].itemListLabel,
    },
    {
      id: "seed-2",
      at: "2024-12-15T14:30:00.000Z",
      author: "Alexander.D",
      senderRole: "packer",
      channel: "packing",
      body: 'PLS MAKE SURE INSCRIPTIONS ARE: Inscription #1: Always, Inscription #2: With You"',
      itemId: "pack-item-2",
      itemLabel: PACK_LINE_ITEM_META[1].itemListLabel,
    },
    {
      id: "seed-3",
      at: "2024-12-12T03:23:00.000Z",
      author: "Patricia.G",
      senderRole: "csr",
      channel: "csr",
      body:
        "Special requests: please make sure: Inscription #2: with 2 capital letters, sent picture before shipping.",
      itemId: "pack-item-1",
      itemLabel: PACK_LINE_ITEM_META[0].itemListLabel,
    },
    {
      id: "seed-5",
      at: "2024-12-08T11:00:00.000Z",
      author: "CSR Team",
      senderRole: "csr",
      channel: "csr",
      body: "Customer called — please double-check chain length before seal.",
      itemId: null,
      itemLabel: REMARK_ALL_PRODUCTS_LABEL,
    },
  ];
}

type ShippingRouteRow = { id: string; carrier: string; method: string; eta: string };

const SHIPPING_ROUTE_ROWS: ShippingRouteRow[] = [
  { id: "fedex-express", carrier: "FedEx", method: "Express", eta: "Dec 20, 2025" },
  { id: "usps-expedited", carrier: "USPS", method: "Expedited", eta: "Dec 12, 2025" },
  { id: "ups-standard", carrier: "UPS", method: "Standard", eta: "Dec 12, 2025" },
  { id: "fedex-expedited", carrier: "FedEx", method: "Expedited", eta: "Dec 18, 2025" },
  { id: "usps-standard", carrier: "USPS", method: "Standard", eta: "Dec 31, 2025" },
];

const INITIAL_CARRIER_ROUTE_ID = "fedex-express";

/** Header “Hungary” factory demo: carrier route shown in shipment details. */

/** Logos in `public/carriers/` (e.g. `ship-fedex.svg`). */
function toSlug(v: string) {
  return v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function carrierLogoPublicUrl(carrierSlug: string) {
  const base = import.meta.env.BASE_URL;
  const root = base.endsWith("/") ? base : `${base}/`;
  return `${root}carriers/ship-${carrierSlug}.svg`;
}

function findCarrierLogoSrc(route: ShippingRouteRow): string | null {
  return carrierLogoPublicUrl(toSlug(route.carrier));
}

function formatCarrierRouteDisplay(route: ShippingRouteRow) {
  return `${route.carrier} ${route.method}`;
}

/** Shipment details “Carrier Route” field only: light pill behind logo + service name */
const carrierRouteServiceBadgeBoxSx = {
  bgcolor: "rgba(219, 240, 255, 1)",
  py: 0.5,
  px: 1,
  borderRadius: "4px",
  boxSizing: "border-box" as const,
  width: "100%",
  minWidth: 0,
};

function findShippingRoute(id: string): ShippingRouteRow | undefined {
  return SHIPPING_ROUTE_ROWS.find((r) => r.id === id);
}

function ShippingRouteColumnLabels({ route }: { route: ShippingRouteRow }) {
  const logoSrc = findCarrierLogoSrc(route);
  return (
    <Stack direction="row" spacing={4} flex={1} sx={{ minWidth: 0 }}>
      <Box sx={{ flex: "1 1 0%", minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ textTransform: "capitalize" }}>
          Carrier
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          spacing={0}
          sx={{ alignSelf: "flex-start", pt: 0.25, gap: "8px", minWidth: 0 }}
        >
          {logoSrc ? (
            <Box
              component="img"
              src={logoSrc}
              alt={formatCarrierRouteDisplay(route)}
              sx={{ height: 16, width: "auto", maxWidth: 88, objectFit: "contain", display: "block", flexShrink: 0 }}
            />
          ) : null}
          <Typography variant="body1" color="text.primary" letterSpacing="0.15px" sx={{ minWidth: 0 }}>
            {formatCarrierRouteDisplay(route)}
          </Typography>
        </Stack>
      </Box>
      <Box sx={{ flex: "1 1 0%", minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          ETA
        </Typography>
        <Typography variant="body1" color="text.primary" letterSpacing="0.15px">
          {route.eta}
        </Typography>
      </Box>
    </Stack>
  );
}

type AddressForm = {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  email: string;
  phone: string;
};

const DEFAULT_ADDRESS_FORM: AddressForm = {
  name: "Clayton Click",
  street: "948 Highway St 54 E",
  city: "Covington",
  state: "New York",
  zipCode: "38193",
  country: "United States",
  email: "ClaytinClick@gmail.com",
  phone: "1-(516)-123-6954",
};

const ADDRESS_STATE_OPTIONS = [
  "New York",
  "California",
  "Texas",
  "Florida",
  "Washington",
  "Georgia",
  "Virginia",
  "New Jersey",
];

const ADDRESS_ZIP_OPTIONS = ["38193", "10001", "94102", "75201", "30301"];

function addressFormsEqual(a: AddressForm, b: AddressForm): boolean {
  return (
    a.name === b.name &&
    a.street === b.street &&
    a.city === b.city &&
    a.state === b.state &&
    a.zipCode === b.zipCode &&
    a.country === b.country &&
    a.email === b.email &&
    a.phone === b.phone
  );
}

function formatDestinationSummary(form: AddressForm) {
  return `${form.state}, ${form.country}`;
}

function UpdateAddressDialog({
  open,
  onClose,
  savedForm,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  savedForm: AddressForm;
  onSave: (form: AddressForm) => void;
}) {
  const [form, setForm] = useState<AddressForm>(savedForm);
  const [baseline, setBaseline] = useState<AddressForm>(savedForm);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (open) {
      const next = { ...savedForm };
      setForm(next);
      setBaseline(next);
      setValidated(false);
    }
  }, [open, savedForm]);

  const isDirty = useMemo(() => !addressFormsEqual(form, baseline), [form, baseline]);

  const patch = (field: keyof AddressForm, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setValidated(false);
  };

  const handleValidate = () => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    const requiredOk =
      form.name.trim() &&
      form.street.trim() &&
      form.city.trim() &&
      form.state &&
      form.zipCode &&
      form.country.trim() &&
      form.phone.trim();
    if (!emailOk || !requiredOk) return;
    setValidated(true);
  };

  const handleSave = () => {
    if (!validated) return;
    onSave({ ...form });
    onClose();
  };

  const rowLabelSx = { width: 120, flexShrink: 0, fontWeight: 600, color: "text.primary" };

  const fieldSx = {
    "& .MuiOutlinedInput-root": { borderRadius: 1 },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          minHeight: 500,
          maxHeight: "calc(100% - 64px)",
        },
      }}
    >
      <StandardDialogTitle onClose={onClose}>Update Address Details</StandardDialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2.5, pb: 2 }}>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={rowLabelSx}>Name</Typography>
            <TextField
              fullWidth
              size="small"
              value={form.name}
              onChange={(e) => patch("name", e.target.value)}
              sx={fieldSx}
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={rowLabelSx}>Street</Typography>
            <TextField
              fullWidth
              size="small"
              value={form.street}
              onChange={(e) => patch("street", e.target.value)}
              sx={fieldSx}
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={rowLabelSx}>City</Typography>
            <TextField
              fullWidth
              size="small"
              value={form.city}
              onChange={(e) => patch("city", e.target.value)}
              sx={fieldSx}
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={rowLabelSx}>State</Typography>
            <FormControl fullWidth size="small" sx={fieldSx}>
              <Select
                value={form.state}
                onChange={(e: SelectChangeEvent<string>) => patch("state", e.target.value)}
              >
                {ADDRESS_STATE_OPTIONS.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={rowLabelSx}>Zip Code</Typography>
            <FormControl fullWidth size="small" sx={fieldSx}>
              <Select
                value={form.zipCode}
                onChange={(e: SelectChangeEvent<string>) => patch("zipCode", e.target.value)}
              >
                {ADDRESS_ZIP_OPTIONS.map((z) => (
                  <MenuItem key={z} value={z}>
                    {z}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={rowLabelSx}>Country</Typography>
            <TextField
              fullWidth
              size="small"
              value={form.country}
              onChange={(e) => patch("country", e.target.value)}
              sx={fieldSx}
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={rowLabelSx}>Email</Typography>
            <TextField
              fullWidth
              size="small"
              value={form.email}
              onChange={(e) => patch("email", e.target.value)}
              sx={fieldSx}
            />
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography sx={rowLabelSx}>Phone</Typography>
            <TextField
              fullWidth
              size="small"
              value={form.phone}
              onChange={(e) => patch("phone", e.target.value)}
              sx={fieldSx}
            />
          </Stack>
          {validated && (
            <Alert severity="success" sx={{ mt: 1 }}>
              Address validated successfully. You can save your changes.
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between", alignItems: "center" }}>
        <Button variant="outlined" onClick={onClose} sx={DIALOG_CANCEL_BUTTON_SX}>
          Cancel
        </Button>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="contained"
            disabled={!isDirty || validated}
            onClick={handleValidate}
            sx={{
              ...(!isDirty || validated
                ? {
                    bgcolor: "grey.400",
                    color: "grey.100",
                    "&.Mui-disabled": { bgcolor: "grey.400", color: "grey.200" },
                  }
                : {
                    bgcolor: "#ed6c02",
                    color: "#fff",
                    "&:hover": { bgcolor: "#e65100" },
                  }),
            }}
          >
            Validate
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!validated}
            onClick={handleSave}
            sx={{
              ...(!validated
                ? {
                    bgcolor: "grey.400",
                    color: "grey.100",
                    "&.Mui-disabled": { bgcolor: "grey.400", color: "grey.200" },
                  }
                : {}),
            }}
          >
            Save
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

type HistoryLogEntry = {
  id: string;
  at: string;
  /** Doubles as the actor: a system name ("WMS") or a person ("David packer"). */
  source: string;
  /** Omitted for compact shipment timeline rows (title + date only). */
  detail?: string;
};

/** `at` is a pre-formatted display string, so new entries must match the fixture format. */
function formatHistoryTimestamp(date: Date): string {
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${time}`;
}

const ORDER_HISTORY_LOG: HistoryLogEntry[] = [
  {
    id: "1",
    source: "PERIODIC SYSTEM",
    at: "1/8/2026 12:00 AM",
    detail:
      "Nightly reconciliation completed. Order line items and fulfillment status were synchronized with the central catalog. No blocking issues detected for this shipment.",
  },
  {
    id: "2",
    source: "OCS",
    at: "1/7/2026 4:32 PM",
    detail:
      "Order confirmation service published status change: In production. All configured personalization checkpoints have been recorded for packing review.",
  },
  {
    id: "3",
    source: "WMS",
    at: "1/6/2026 9:15 AM",
    detail:
      "Warehouse management received pick list. Inventory reserved for SKU bundle associated with this order; carrier preference captured as FedEx Express for destination region.",
  },
  {
    id: "4",
    source: "OCS",
    at: "1/5/2026 2:48 PM",
    detail:
      "Customer service note attached: verify inscription casing and send photo approval prior to ship. Message routed to packing workflow.",
  },
  {
    id: "5",
    source: "PERIODIC SYSTEM",
    at: "1/4/2026 8:00 AM",
    detail: "Order created from OMS and assigned to site 27. Initial routing rules applied.",
  },
];

/**
 * Shipment timeline (newest first). `source` = parenthetical actor (order-history caption style);
 * `detail` = narrative after the close-paren in the spec.
 */
const SHIPMENT_HISTORY_LOG: HistoryLogEntry[] = [
  {
    id: "sh-17",
    source: "Shipment system",
    at: "5/4/2026 3:42 PM",
    detail: "Status moved to packed.",
  },
  {
    id: "sh-16",
    source: "Fedex",
    at: "5/4/2026 3:30 PM",
    detail: "tracking ID provided 41236471846.",
  },
  {
    id: "sh-15",
    source: "Shipment system",
    at: "5/4/2026 3:18 PM",
    detail: "API initiated.",
  },
  {
    id: "sh-14",
    source: "David packer",
    at: "5/4/2026 3:05 PM",
    detail: "Address changed.",
  },
  {
    id: "sh-13",
    source: "Fedex API",
    at: "5/4/2026 2:52 PM",
    detail: "API failed due to wrong ZIP.",
  },
  {
    id: "sh-12",
    source: "Shipment system",
    at: "5/4/2026 2:35 PM",
    detail: "API initiated.",
  },
  {
    id: "sh-11",
    source: "Shipment system",
    at: "5/4/2026 2:10 PM",
    detail: "Status moved to ready to pack.",
  },
  {
    id: "sh-10",
    source: "Item tracker, Noga packing sorter",
    at: "5/4/2026 1:48 PM",
    detail: "On hold released.",
  },
  {
    id: "sh-9",
    source: "Shipment service",
    at: "5/4/2026 1:25 PM",
    detail: "Pending item moved to sent.",
  },
  {
    id: "sh-8",
    source: "Item tracker",
    at: "5/4/2026 1:02 PM",
    detail: "Item stored in on hold container 321 Location Packing sorter shelf.",
  },
  {
    id: "sh-7",
    source: "CSR",
    at: "5/4/2026 12:40 PM",
    detail: 'Remark received "Customer added new item" from Bruno CSR.',
  },
  {
    id: "sh-6",
    source: "Shipment service",
    at: "5/4/2026 12:15 PM",
    detail: "Pending item detected.",
  },
  {
    id: "sh-5",
    source: "Shipment service",
    at: "5/4/2026 11:50 AM",
    detail: "Status moved to on hold with reason CSR hold.",
  },
  {
    id: "sh-4",
    source: "Shipment service",
    at: "5/4/2026 11:28 AM",
    detail: "Status moved to ready to pack.",
  },
  {
    id: "sh-3",
    source: "Shipment service route assignment",
    at: "5/4/2026 11:05 AM",
    detail: "Route assigned.",
  },
  {
    id: "sh-2",
    source: "Shipment service",
    at: "5/4/2026 10:42 AM",
    detail: "Status moved to draft.",
  },
  {
    id: "sh-1",
    source: "Shipment service create shipment",
    at: "5/4/2026 10:15 AM",
    detail: "Shipment created.",
  },
];

function HistoryLogDialog({
  open,
  onClose,
  title,
  subtitle,
  entries,
  captionUppercase = true,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: ReactNode;
  entries: HistoryLogEntry[];
  /** Order / shipment caption line: uppercase system-style labels when true. */
  captionUppercase?: boolean;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          minHeight: 500,
          maxHeight: "calc(100% - 64px)",
        },
      }}
    >
      <StandardDialogTitle onClose={onClose} subtitle={subtitle}>
        {title}
      </StandardDialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2.5, pb: 2 }}>
        <Box sx={{ maxHeight: 440, overflow: "auto", pr: 0.5 }}>
          {entries.map((entry, index) => {
            const isLast = index === entries.length - 1;
            const timelineIndent = "22px";
            return (
              <Box key={entry.id}>
                {index > 0 ? (
                  <Box sx={{ height: 16, display: "flex", alignItems: "stretch" }}>
                    <Box
                      sx={{
                        width: 2,
                        height: "100%",
                        ml: timelineIndent,
                        bgcolor: "divider",
                        borderRadius: 0.5,
                        flexShrink: 0,
                      }}
                    />
                  </Box>
                ) : null}
                <Paper
                  variant="outlined"
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    boxSizing: "border-box",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        flexShrink: 0,
                        mt: 0.35,
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack
                        direction="row"
                        alignItems="flex-start"
                        justifyContent="space-between"
                        gap={1.5}
                        sx={{ mb: 1.25 }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={600}
                          letterSpacing={captionUppercase ? "0.06em" : "0.02em"}
                          sx={{
                            textTransform: captionUppercase ? "uppercase" : "none",
                            lineHeight: 1.2,
                          }}
                        >
                          {entry.source}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ flexShrink: 0, lineHeight: 1.2 }}
                        >
                          {entry.at}
                        </Typography>
                      </Stack>
                      {entry.detail != null && entry.detail !== "" ? (
                        <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.5 }}>
                          {entry.detail}
                        </Typography>
                      ) : null}
                    </Box>
                  </Stack>
                </Paper>
                {!isLast ? (
                  <Box sx={{ height: 16, display: "flex", alignItems: "stretch" }}>
                    <Box
                      sx={{
                        width: 2,
                        height: "100%",
                        ml: timelineIndent,
                        bgcolor: "divider",
                        borderRadius: 0.5,
                        flexShrink: 0,
                      }}
                    />
                  </Box>
                ) : null}
              </Box>
            );
          })}
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2, justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary" onClick={onClose}>
          Close Log
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function OrderHistoryLogDialog({
  open,
  onClose,
  orderNumber,
}: {
  open: boolean;
  onClose: () => void;
  orderNumber: string;
}) {
  return (
    <HistoryLogDialog
      open={open}
      onClose={onClose}
      title="Order History Log"
      subtitle={
        <Typography variant="body2" color="text.secondary">
          Order #{orderNumber}
        </Typography>
      }
      entries={ORDER_HISTORY_LOG}
      captionUppercase
    />
  );
}

function ShipmentHistoryLogDialog({
  open,
  onClose,
  shipmentId,
  entries,
}: {
  open: boolean;
  onClose: () => void;
  shipmentId: string;
  /** Live log — recovery actions are appended at runtime, so this is state, not the fixture. */
  entries: HistoryLogEntry[];
}) {
  return (
    <HistoryLogDialog
      open={open}
      onClose={onClose}
      title="Shipment History Log"
      subtitle={
        <Typography variant="body2" color="text.secondary">
          Shipment #{shipmentId}
        </Typography>
      }
      entries={entries}
      captionUppercase
    />
  );
}

const SEND_TO_FIX_PLACEHOLDER =
  "Please explain briefly why we need to send this for fixing.";

function SendToFixDialog({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (open) {
      setReason("");
    }
  }, [open]);

  const canSubmit = reason.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(reason.trim());
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      scroll="paper"
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 540,
          minHeight: 500,
          maxHeight: "calc(100% - 64px)",
          borderRadius: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      <StandardDialogTitle onClose={onClose}>Send to Fix</StandardDialogTitle>
      <Divider sx={{ flexShrink: 0 }} />
      <DialogContent
        sx={{
          px: 3,
          pt: 3,
          pb: 1,
          flex: "1 1 auto",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          overflow: "hidden",
        }}
      >
        <Typography variant="body1" color="text.primary" sx={{ letterSpacing: "0.15px", flexShrink: 0 }}>
          Reason:
        </Typography>
        <TextField
          multiline
          minRows={4}
          fullWidth
          placeholder={SEND_TO_FIX_PLACEHOLDER}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          variant="outlined"
          inputProps={{ "aria-label": "Reason for send to fix" }}
          sx={{
            flexShrink: 0,
            alignSelf: "stretch",
            "& .MuiOutlinedInput-root": {
              alignItems: "flex-start",
              overflow: "auto",
              paddingTop: 1.5,
              paddingBottom: 1.5,
              boxSizing: "border-box",
            },
          }}
        />
      </DialogContent>
      <Divider sx={{ flexShrink: 0 }} />
      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between", flexShrink: 0 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ ...DIALOG_CANCEL_BUTTON_SX, py: 1, px: 2.75 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!canSubmit}
          onClick={handleSubmit}
          sx={{ py: 1, px: 2.75 }}
        >
          Send to Fix
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/** Design ref 2056:22696 — pending / sent-to-fix acknowledgement. */
const PENDING_MODAL_ICON_CIRCLE_BG = "#FEF3E7";
const PENDING_MODAL_REASON_BOX_BG = "#F5F5F5";

function ShipmentPendingDialog({
  open,
  reasonForFix,
  onOk,
  onCancel,
}: {
  open: boolean;
  reasonForFix: string;
  onOk: () => void;
  onCancel: () => void;
}) {
  const reasonDisplay = reasonForFix.trim() || "—";

  return (
    <Dialog
      data-node-id="2056:22696"
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || reason === "escapeKeyDown") onCancel();
      }}
      maxWidth={false}
      scroll="paper"
      slotProps={{
        backdrop: {
          sx: { bgcolor: "rgba(0,0,0,0.5)" },
        },
      }}
      PaperProps={{
        component: Paper,
        elevation: 0,
        sx: {
          width: "100%",
          maxWidth: 560,
          minHeight: 500,
          maxHeight: "calc(100% - 64px)",
          borderRadius: 1,
          overflow: "hidden",
          ...elevationSx,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <StandardDialogTitle onClose={onCancel}>Shipment Pending</StandardDialogTitle>
      <Divider sx={{ flexShrink: 0 }} />
      <DialogContent
        sx={{
          pt: 3,
          pb: 3,
          px: 3,
          flexShrink: 0,
          flex: "1 1 auto",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack
          alignItems="center"
          spacing={2.5}
          sx={{ textAlign: "center", width: "100%", maxWidth: 440, mx: "auto" }}
        >
          {/* Figma 2126:26531 — pending glyph (Material Pending outlined) */}
          <Box
            aria-hidden
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: PENDING_MODAL_ICON_CIRCLE_BG,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PendingOutlinedIcon sx={{ fontSize: 36, color: "warning.main" }} />
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: "text.primary",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.15px",
              lineHeight: 1.5,
              maxWidth: 440,
            }}
          >
            This shipment is waiting for a fix.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: 14,
              fontWeight: 400,
              letterSpacing: "0.15px",
              lineHeight: 1.5,
              maxWidth: 440,
            }}
          >
            Check the item. Is the problem fixed? Click &apos;OK&apos; if it is ready to pack.
          </Typography>
          <Box
            sx={{
              width: "100%",
              maxWidth: 440,
              mt: 0.5,
              py: 1.5,
              px: 2,
              borderRadius: 1,
              bgcolor: PENDING_MODAL_REASON_BOX_BG,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              textAlign: "center",
            }}
          >
            <ChatBubbleOutlineIcon sx={{ fontSize: 22, color: "text.secondary", flexShrink: 0 }} />
            <Typography variant="body2" sx={{ color: "text.primary", lineHeight: 1.5, letterSpacing: "0.15px" }}>
              <Box component="span" fontWeight={700}>
                Reason for fix:
              </Box>{" "}
              <Box component="span" fontWeight={400}>
                &ldquo;{reasonDisplay}&rdquo;
              </Box>
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          justifyContent: "space-between",
          flexShrink: 0,
          borderTop: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{ ...DIALOG_CANCEL_BUTTON_SX, py: 1, px: 2.5 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onOk}
          sx={{ py: 1, px: 2.5 }}
        >
          OK (Fix Done)
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/** Figma 1778:10342 — Fallback Pack dialog prototype field values. */
const FALLBACK_PACK_PROTOTYPE = {
  facilityId: "IL-TLV",
  securityCode: "IL-123",
  facilityAddress: "Amindav 3, Tel Aviv 1234958 Israel",
  customerName: "Claytin Click",
  street: "123 Main Street",
  city: "Port Washington",
  zip: "11050",
  country: "United States",
  email: "ClaytinClick@gmail.com",
  phone: "1-(516)-123-6954",
  productName: "Compass Necklace in 18K Gold Plating",
  sku: "123-9482-3894",
  quantity: "1",
  unitValue: "$27 USD",
  weight: "360g",
  taxingMode: "DDP",
  iossNumber: "N/A",
  taxComplianceUnitValue: "$27 USD",
} as const;

function FallbackPackCopyField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const copy = () => {
    void navigator.clipboard?.writeText(value).catch(() => {});
  };
  return (
    <TextField
      label={label}
      value={value}
      fullWidth
      size="medium"
      variant="outlined"
      InputProps={{
        readOnly: true,
        sx: { pr: 0.5 },
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip title="Copy">
              <IconButton aria-label={`Copy ${label}`} edge="end" size="small" onClick={copy}>
                <ContentCopyIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
      }}
    />
  );
}

function FallbackPackStepDot({
  stepNum,
  active,
  completed,
}: {
  stepNum: number;
  active: boolean;
  completed?: boolean;
}) {
  const filled = Boolean(completed || active);
  return (
    <Box
      sx={{
        width: 24,
        height: 24,
        borderRadius: "50%",
        bgcolor: filled ? "primary.main" : "#9e9e9e",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        lineHeight: 1.66,
        letterSpacing: "0.4px",
        border: "2px solid",
        borderColor: "background.paper",
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      {completed ? <CheckIcon sx={{ fontSize: 15 }} /> : stepNum}
    </Box>
  );
}

function FallbackPackSectionTitle({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: 1, pb: 1 }}>
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 500,
          letterSpacing: "0.15px",
          lineHeight: 1.5,
          color: "text.primary",
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}

function FallbackPackDialog({
  open,
  onClose,
  onManualPack,
}: {
  open: boolean;
  onClose: () => void;
  onManualPack?: (payload: { carrierRouteId: string; manualTrackingId: string }) => void;
}) {
  const d = FALLBACK_PACK_PROTOTYPE;
  const [activeStep, setActiveStep] = useState(0);
  const [manualTrackingId, setManualTrackingId] = useState("");
  const [fallbackCarrierRouteId, setFallbackCarrierRouteId] = useState(INITIAL_CARRIER_ROUTE_ID);

  useEffect(() => {
    if (!open) return;
    setActiveStep(0);
    setManualTrackingId("");
    setFallbackCarrierRouteId(INITIAL_CARRIER_ROUTE_ID);
  }, [open]);

  const handleClose = () => {
    onClose();
  };

  const footerPrimary =
    activeStep === 0 ? (
      <Button
        variant="contained"
        color="primary"
        onClick={() => setActiveStep(1)}
        sx={{
          px: 2.75,
          py: 1,
          textTransform: "uppercase",
          fontWeight: 500,
          fontSize: 15,
          letterSpacing: "0.46px",
          boxShadow:
            "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
        }}
      >
        Continue
      </Button>
    ) : (
      <Button
        variant="contained"
        color="warning"
        disabled={!manualTrackingId.trim()}
        onClick={() => {
          const tid = manualTrackingId.trim();
          if (!tid) return;
          onManualPack?.({ carrierRouteId: fallbackCarrierRouteId, manualTrackingId: tid });
          handleClose();
        }}
        sx={{
          px: 2.75,
          py: 1,
          borderRadius: "50px",
          textTransform: "uppercase",
          fontWeight: 500,
          fontSize: 15,
          letterSpacing: "0.46px",
          boxShadow:
            "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)",
          "&:not(.Mui-disabled)": {
            bgcolor: "#ed6c02",
            color: "#fff",
            "&:hover": { bgcolor: "#e65100" },
          },
        }}
      >
        Manual Pack
      </Button>
    );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      scroll="paper"
      slotProps={{ backdrop: { sx: { bgcolor: "rgba(0,0,0,0.5)" } } }}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 700,
          borderRadius: 1,
          display: "flex",
          flexDirection: "column",
          maxHeight: "calc(100% - 64px)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        component="div"
        sx={{
          pt: 3,
          px: 3,
          pb: 0,
          pr: 5,
          position: "relative",
          fontSize: 16,
          fontWeight: 500,
          letterSpacing: "0.15px",
          lineHeight: 1.5,
        }}
      >
        Fallback Pack
        <IconButton
          aria-label="Close"
          onClick={handleClose}
          size="small"
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box sx={{ px: 3, pt: 3, pb: 0 }}>
        <Divider />
      </Box>
      <DialogContent
        sx={{
          px: 3,
          pt: 6,
          pb: 6,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: 1,
            /** Connector joins circle edge to circle edge; centers at 25% / 75% for equal half-width columns. */
          }}
          role="group"
          aria-label="Fallback pack steps"
        >
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: "calc(25% + 12px)",
              width: "calc(50% - 24px)",
              height: "1px",
              transform: "translateY(-50%)",
              bgcolor: "#bdbdbd",
              overflow: "hidden",
              zIndex: 0,
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: activeStep === 0 ? "0%" : "100%",
                bgcolor: "primary.main",
                transition: "width 0.55s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </Box>
          <Stack direction="row" alignItems="flex-start" sx={{ position: "relative", zIndex: 1, width: 1 }}>
            <Stack alignItems="center" spacing={1} sx={{ flex: "1 1 0", minWidth: 0 }}>
              <FallbackPackStepDot stepNum={1} active={activeStep === 0} completed={activeStep === 1} />
              <Typography
                variant={activeStep === 0 ? "subtitle2" : "body2"}
                fontWeight={activeStep === 0 ? 500 : 400}
                color="text.primary"
                textAlign="center"
                sx={{
                  letterSpacing: activeStep === 0 ? "0.1px" : "0.17px",
                  lineHeight: activeStep === 0 ? 1.57 : 1.43,
                  px: 0.5,
                }}
              >
                Shipment Details
              </Typography>
            </Stack>
            <Stack alignItems="center" spacing={1} sx={{ flex: "1 1 0", minWidth: 0 }}>
              <FallbackPackStepDot stepNum={2} active={activeStep === 1} />
              <Typography
                variant={activeStep === 1 ? "subtitle2" : "body2"}
                fontWeight={activeStep === 1 ? 500 : 400}
                color="text.primary"
                textAlign="center"
                sx={{
                  letterSpacing: activeStep === 1 ? "0.1px" : "0.17px",
                  lineHeight: activeStep === 1 ? 1.57 : 1.43,
                  px: 0.5,
                }}
              >
                Manual Tracking ID
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {activeStep === 0 ? (
          <Stack spacing={4} sx={{ width: 1, px: { xs: 0, sm: 3.5 }, pb: 2 }}>
            <Stack spacing={2}>
              <FallbackPackSectionTitle>Packing Facility Details</FallbackPackSectionTitle>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <FallbackPackCopyField label="Facility ID" value={d.facilityId} />
                <FallbackPackCopyField label="Security Code" value={d.securityCode} />
              </Stack>
              <FallbackPackCopyField label="Facility Address" value={d.facilityAddress} />
            </Stack>

            <Stack spacing={2}>
              <FallbackPackSectionTitle>Customer Address Details</FallbackPackSectionTitle>
              <FallbackPackCopyField label="Name" value={d.customerName} />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <FallbackPackCopyField label="Street" value={d.street} />
                <FallbackPackCopyField label="City" value={d.city} />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <FallbackPackCopyField label="Zip Code" value={d.zip} />
                <FallbackPackCopyField label="Country" value={d.country} />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <FallbackPackCopyField label="Email" value={d.email} />
                <FallbackPackCopyField label="Phone" value={d.phone} />
              </Stack>
            </Stack>

            <Stack spacing={2}>
              <FallbackPackSectionTitle>Item Details</FallbackPackSectionTitle>
              <FallbackPackCopyField label="Product Name" value={d.productName} />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <FallbackPackCopyField label="SKU" value={d.sku} />
                <FallbackPackCopyField label="Quantity" value={d.quantity} />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <FallbackPackCopyField label="Unite Value" value={d.unitValue} />
                <FallbackPackCopyField label="Weight" value={d.weight} />
              </Stack>
            </Stack>

            <Stack spacing={2}>
              <FallbackPackSectionTitle>Tax and Complicance</FallbackPackSectionTitle>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ width: 1 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <FallbackPackCopyField label="Taxing Mode" value={d.taxingMode} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <FallbackPackCopyField label="IOSS Number" value={d.iossNumber} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <FallbackPackCopyField label="Unite Value" value={d.taxComplianceUnitValue} />
                </Box>
              </Stack>
            </Stack>
          </Stack>
        ) : (
          <Stack
            spacing={3}
            sx={{ width: 1, px: { xs: 0, sm: 3.5 }, py: 2, minHeight: 240, alignItems: "center" }}
          >
            <LocalShippingOutlinedIcon sx={{ fontSize: 40, color: "action.disabled" }} />
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "0.15px",
                lineHeight: 1.5,
                color: "text.primary",
                textAlign: "center",
              }}
            >
              Manual Tracking ID Details
            </Typography>
            <Stack spacing={2.5} sx={{ width: 1, maxWidth: 480, alignSelf: "center" }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="fallback-pack-carrier-route-label">Carrier Route</InputLabel>
                <Select<string>
                  labelId="fallback-pack-carrier-route-label"
                  label="Carrier Route"
                  value={fallbackCarrierRouteId}
                  onChange={(e: SelectChangeEvent<string>) => setFallbackCarrierRouteId(e.target.value)}
                >
                  {SHIPPING_ROUTE_ROWS.map((row) => (
                    <MenuItem key={row.id} value={row.id}>
                      {formatCarrierRouteDisplay(row)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Manual Tracking ID"
                placeholder="Enter ID"
                value={manualTrackingId}
                onChange={(e) => setManualTrackingId(e.target.value)}
                fullWidth
                variant="outlined"
                autoFocus
              />
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          justifyContent: "space-between",
          borderTop: 1,
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            textTransform: "uppercase",
            fontWeight: 500,
            fontSize: 15,
            letterSpacing: "0.46px",
            color: "primary.main",
            py: 1,
            px: 1.5,
          }}
        >
          Cancel
        </Button>
        <Stack direction="row" spacing={1} alignItems="center">
          {activeStep === 1 ? (
            <Button
              onClick={() => setActiveStep(0)}
              sx={{
                textTransform: "uppercase",
                fontWeight: 500,
                fontSize: 15,
                letterSpacing: "0.46px",
                color: "primary.main",
              }}
            >
              Back
            </Button>
          ) : null}
          {footerPrimary}
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

function joinShipmentDisplayRef(id: string) {
  const t = id.trim();
  if (t.startsWith("SH-")) return `#${t}`;
  if (t.toUpperCase().startsWith("SH")) return `#${t}`;
  return `#SH-${t}`;
}

function splitNewShipmentDisplayRef(id: string | null) {
  if (id == null || !id.trim()) return "—";
  const t = id.trim();
  if (t.startsWith("#")) return t;
  if (t.startsWith("SH-")) return `#${t}`;
  if (/^\d+$/.test(t)) return `#${t}`;
  return `#${t}`;
}

function JoinShipmentSourceSection({
  shipmentId,
  items,
  onMoveToCurrent,
  onClear,
  showClear = true,
}: {
  shipmentId: string;
  items: JoinTransferItem[];
  onMoveToCurrent: (itemId: string) => void;
  onClear?: () => void;
  showClear?: boolean;
}) {
  return (
    <Stack spacing={1.5} sx={{ minWidth: 0 }}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
        <Typography variant="subtitle1" fontWeight={600} color="text.primary" sx={{ letterSpacing: "0.15px" }}>
          Shipment {joinShipmentDisplayRef(shipmentId)} ({items.length} items)
        </Typography>
        {showClear && onClear ? (
          <IconButton aria-label="Clear shipment" size="small" onClick={onClear}>
            <CloseIcon fontSize="small" />
          </IconButton>
        ) : null}
      </Stack>
      <Stack spacing={1.5}>
        {items.length === 0 ? (
          <Stack alignItems="center" justifyContent="center" spacing={1.5} sx={{ px: 3, py: 4, minHeight: 120 }}>
            <Inventory2OutlinedIcon sx={{ fontSize: 32, color: "action.disabled" }} />
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
              sx={{ letterSpacing: "0.15px", lineHeight: 1.5 }}
            >
              No Items Available
            </Typography>
          </Stack>
        ) : (
          items.map((item) => (
            <Paper
              key={item.id}
              variant="outlined"
              sx={{
                p: 1.5,
                borderRadius: 1,
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                component="img"
                src={item.image}
                alt=""
                sx={{ width: 56, height: 56, borderRadius: 0.5, objectFit: "cover", flexShrink: 0 }}
              />
              <Typography variant="body2" fontWeight={500} sx={{ flex: "1 1 auto", minWidth: 0, lineHeight: 1.4 }}>
                {item.title}
              </Typography>
              {item.movable ? (
                <Button
                  size="small"
                  color="primary"
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
                  onClick={() => onMoveToCurrent(item.id)}
                  sx={{
                    flexShrink: 0,
                    textTransform: "none",
                    fontWeight: 600,
                    minWidth: "auto",
                    px: 0.5,
                  }}
                >
                  Move
                </Button>
              ) : null}
            </Paper>
          ))
        )}
      </Stack>
    </Stack>
  );
}

function JoinShipmentDialog({
  open,
  onClose,
  currentShipmentId,
  prefillSourceShipmentId = null,
  dualSourceShipments = null,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  currentShipmentId: string;
  /** When set (e.g. similar-order pair), left column loads this shipment immediately. */
  prefillSourceShipmentId?: string | null;
  /** When set (`similar-multiple`), left column shows each shipment section without scan. */
  dualSourceShipments?: JoinSourceShipmentColumn[] | null;
  onConfirm?: (nextCurrentItems: JoinTransferItem[]) => void;
}) {
  const [sourceShipmentInput, setSourceShipmentInput] = useState("");
  const [loadedSourceId, setLoadedSourceId] = useState<string | null>(null);
  const [sourceItems, setSourceItems] = useState<JoinTransferItem[]>([]);
  const [multiSourceColumns, setMultiSourceColumns] = useState<JoinSourceShipmentColumn[]>([]);
  const [currentItems, setCurrentItems] = useState<JoinTransferItem[]>([]);
  const [initialLayoutKey, setInitialLayoutKey] = useState("");

  const isDualSourceMode = dualSourceShipments != null && dualSourceShipments.length > 0;

  useEffect(() => {
    if (!open) return;
    const nextCurrent = JOIN_CURRENT_SEED.map((x) => ({ ...x }));
    if (isDualSourceMode && dualSourceShipments) {
      const nextSources = dualSourceShipments.map((col) => ({
        shipmentId: col.shipmentId,
        items: col.items.map((x) => ({ ...x })),
      }));
      setMultiSourceColumns(nextSources);
      setLoadedSourceId(null);
      setSourceItems([]);
      setSourceShipmentInput("");
      setCurrentItems(nextCurrent);
      setInitialLayoutKey(joinMultiSourceLayoutKey(nextSources, nextCurrent));
      return;
    }
    const prefill = prefillSourceShipmentId?.trim();
    if (prefill) {
      const nextSource = JOIN_SOURCE_SEED.map((x) => ({ ...x }));
      setMultiSourceColumns([]);
      setLoadedSourceId(prefill);
      setSourceShipmentInput(prefill);
      setSourceItems(nextSource);
      setCurrentItems(nextCurrent);
      setInitialLayoutKey(joinLayoutKey(nextSource, nextCurrent));
      return;
    }
    setMultiSourceColumns([]);
    setSourceShipmentInput("");
    setLoadedSourceId(null);
    setSourceItems([]);
    setCurrentItems(nextCurrent);
    setInitialLayoutKey("");
  }, [open, prefillSourceShipmentId, currentShipmentId, isDualSourceMode, dualSourceShipments]);

  const layoutKey = isDualSourceMode
    ? joinMultiSourceLayoutKey(multiSourceColumns, currentItems)
    : joinLayoutKey(sourceItems, currentItems);
  const transferDirty =
    initialLayoutKey.length > 0 &&
    layoutKey !== initialLayoutKey &&
    (isDualSourceMode || Boolean(loadedSourceId));

  const handleLoadSource = () => {
    const id = sourceShipmentInput.trim() || "5928503726";
    const nextSource = JOIN_SOURCE_SEED.map((x) => ({ ...x }));
    const nextCurrent = JOIN_CURRENT_SEED.map((x) => ({ ...x }));
    setLoadedSourceId(id);
    setSourceItems(nextSource);
    setCurrentItems(nextCurrent);
    setInitialLayoutKey(joinLayoutKey(nextSource, nextCurrent));
  };

  const handleClearLoadedSource = () => {
    setLoadedSourceId(null);
    setSourceItems([]);
    setSourceShipmentInput("");
    setCurrentItems(JOIN_CURRENT_SEED.map((x) => ({ ...x })));
    setInitialLayoutKey("");
  };

  const moveToCurrentFromSource = (id: string) => {
    let moved: JoinTransferItem | null = null;
    setSourceItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item?.movable) return prev;
      moved = item;
      return prev.filter((i) => i.id !== id);
    });
    if (moved) {
      const item = moved;
      setCurrentItems((c) => [...c, item]);
    }
  };

  const moveToCurrentFromMultiSource = (sourceShipmentId: string, itemId: string) => {
    const column = multiSourceColumns.find((col) => col.shipmentId === sourceShipmentId);
    const item = column?.items.find((i) => i.id === itemId);
    if (!item?.movable) return;
    setMultiSourceColumns((prev) =>
      prev.map((col) =>
        col.shipmentId === sourceShipmentId
          ? { ...col, items: col.items.filter((i) => i.id !== itemId) }
          : col,
      ),
    );
    setCurrentItems((c) => [
      ...c,
      { ...item, movable: true, returnToSourceShipmentId: sourceShipmentId },
    ]);
  };

  const moveToSource = (id: string) => {
    const item = currentItems.find((i) => i.id === id);
    if (!item?.movable) return;
    const returnShipmentId = item.returnToSourceShipmentId;
    setCurrentItems((prev) => prev.filter((i) => i.id !== id));
    if (returnShipmentId && isDualSourceMode) {
      const { returnToSourceShipmentId: _drop, ...rest } = item;
      setMultiSourceColumns((cols) =>
        cols.map((col) =>
          col.shipmentId === returnShipmentId
            ? { ...col, items: [...col.items, { ...rest, movable: true }] }
            : col,
        ),
      );
      return;
    }
    setSourceItems((s) => [...s, item]);
  };

  const handleConfirm = () => {
    /* prototype: wire join API when available */
    onConfirm?.(currentItems);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      scroll="paper"
      slotProps={{ backdrop: { sx: { bgcolor: "rgba(0,0,0,0.5)" } } }}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 960,
          minHeight: 500,
          maxHeight: "calc(100% - 64px)",
          borderRadius: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      <StandardDialogTitle onClose={onClose}>Join Shipment</StandardDialogTitle>
      <Divider sx={{ flexShrink: 0 }} />
      <DialogContent
        sx={{
          pt: 3,
          px: 3,
          pb: 2,
          flex: "1 1 auto",
          minHeight: 420,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Stack direction="row" spacing={0} sx={{ flex: 1, minHeight: 0, alignItems: "stretch" }}>
          <Stack sx={{ flex: "1 1 0%", minWidth: 0, pr: 2 }} spacing={2}>
            {isDualSourceMode ? (
              <Stack spacing={3} sx={{ overflow: "auto", pr: 0.5, flex: 1, minHeight: 0 }}>
                {multiSourceColumns.map((col) => (
                  <JoinShipmentSourceSection
                    key={col.shipmentId}
                    shipmentId={col.shipmentId}
                    items={col.items}
                    showClear={false}
                    onMoveToCurrent={(itemId) => moveToCurrentFromMultiSource(col.shipmentId, itemId)}
                  />
                ))}
              </Stack>
            ) : !loadedSourceId ? (
              <Paper
                variant="outlined"
                sx={{
                  flex: 1,
                  minHeight: 320,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  px: 3,
                  py: 4,
                  borderRadius: 1,
                  borderColor: "divider",
                  bgcolor: "background.paper",
                }}
              >
                <Stack spacing={2.5} sx={{ width: "100%", maxWidth: 360, alignItems: "center" }}>
                  <Inventory2OutlinedIcon sx={{ fontSize: 32, color: "action.disabled" }} />
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ letterSpacing: "0.15px", lineHeight: 1.5 }}
                  >
                    Please Scan or type in Shipment/Order ID to start
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Scan or type in order ID"
                    value={sourceShipmentInput}
                    onChange={(e) => setSourceShipmentInput(e.target.value)}
                    variant="outlined"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleLoadSource();
                    }}
                  />
                </Stack>
              </Paper>
            ) : (
              <Stack spacing={1.5} sx={{ overflow: "auto", pr: 0.5, flex: 1, minHeight: 0 }}>
                <JoinShipmentSourceSection
                  shipmentId={loadedSourceId}
                  items={sourceItems}
                  onMoveToCurrent={moveToCurrentFromSource}
                  onClear={handleClearLoadedSource}
                />
              </Stack>
            )}
          </Stack>

          <Box
            sx={{
              width: 48,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              alignSelf: "stretch",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: "50%",
                width: "1px",
                bgcolor: "divider",
                transform: "translateX(-50%)",
              }}
            />
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", zIndex: 1, py: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "grey.200",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SwapHorizIcon sx={{ color: "text.secondary", fontSize: 22 }} />
              </Box>
            </Box>
          </Box>

          <Stack sx={{ flex: "1 1 0%", minWidth: 0, pl: 2 }} spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} flexWrap="wrap">
              <Typography variant="subtitle1" fontWeight={600} color="text.primary" sx={{ letterSpacing: "0.15px" }}>
                Current Shipment
              </Typography>
              <Typography variant="body2" fontWeight={700} color="text.primary">
                {joinShipmentDisplayRef(currentShipmentId)}
              </Typography>
            </Stack>
            <Stack spacing={1.5} sx={{ overflow: "auto", pr: 0.5, flex: 1, minHeight: 0 }}>
              {currentItems.length === 0 ? (
                <Stack
                  flex={1}
                  alignItems="center"
                  justifyContent="center"
                  spacing={1.5}
                  sx={{ px: 3, py: 6, minHeight: 240 }}
                >
                  <Inventory2OutlinedIcon sx={{ fontSize: 32, color: "action.disabled" }} />
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ letterSpacing: "0.15px", lineHeight: 1.5 }}
                  >
                    No Items Available
                  </Typography>
                </Stack>
              ) : (
                currentItems.map((item) => (
                  <Paper
                    key={item.id}
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      borderRadius: 1,
                      borderColor: "divider",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <Box
                      component="img"
                      src={item.image}
                      alt=""
                      sx={{ width: 56, height: 56, borderRadius: 0.5, objectFit: "cover", flexShrink: 0 }}
                    />
                    <Typography variant="body2" fontWeight={500} sx={{ flex: "1 1 auto", minWidth: 0, lineHeight: 1.4 }}>
                      {item.title}
                    </Typography>
                    {item.movable ? (
                      <Button
                        size="small"
                        color="primary"
                        startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
                        onClick={() => moveToSource(item.id)}
                        sx={{
                          flexShrink: 0,
                          textTransform: "none",
                          fontWeight: 600,
                          minWidth: "auto",
                          px: 0.5,
                        }}
                      >
                        Move
                      </Button>
                    ) : null}
                  </Paper>
                ))
              )}
            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
      <Divider sx={{ flexShrink: 0 }} />
      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between", flexShrink: 0 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ ...DIALOG_CANCEL_BUTTON_SX, py: 1, px: 2.75 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!transferDirty}
          onClick={handleConfirm}
          sx={{ py: 1, px: 2.75 }}
        >
          Confirm & Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function SplitShipmentDialog({
  open,
  onClose,
  currentShipmentId,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  currentShipmentId: string;
  onConfirm?: (
    nextCurrentItems: JoinTransferItem[],
    nextNewItems: JoinTransferItem[],
    newShipmentId: string | null,
    sourceShipmentId: string,
  ) => void;
}) {
  const [currentItems, setCurrentItems] = useState<JoinTransferItem[]>([]);
  const [newItems, setNewItems] = useState<JoinTransferItem[]>([]);
  const [newShipmentId, setNewShipmentId] = useState<string | null>(null);
  const splitBaselineKeyRef = useRef("");

  useLayoutEffect(() => {
    if (!open) return;
    const seed = buildSplitShipmentCurrentItems().map((x) => ({ ...x }));
    splitBaselineKeyRef.current = joinLayoutKey(seed, []);
    setCurrentItems(seed);
    setNewItems([]);
    setNewShipmentId(null);
  }, [open, currentShipmentId]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void (async () => {
      try {
        const id = await loadNewSplitShipmentIdFromApi(currentShipmentId);
        if (!cancelled) setNewShipmentId(id);
      } catch (e) {
        console.error(e);
        const fallback = String(Math.floor(100_000_000 + Math.random() * 900_000_000));
        if (!cancelled) setNewShipmentId(fallback);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, currentShipmentId]);

  const layoutKey = joinLayoutKey(currentItems, newItems);
  const transferDirty = Boolean(splitBaselineKeyRef.current) && layoutKey !== splitBaselineKeyRef.current;

  const moveToNew = (id: string) => {
    let moved: JoinTransferItem | null = null;
    setCurrentItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item?.movable) return prev;
      moved = item;
      return prev.filter((i) => i.id !== id);
    });
    if (moved) setNewItems((c) => [...c, moved!]);
  };

  const moveToCurrent = (id: string) => {
    let moved: JoinTransferItem | null = null;
    setNewItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item?.movable) return prev;
      moved = item;
      return prev.filter((i) => i.id !== id);
    });
    if (moved) setCurrentItems((s) => [...s, moved!]);
  };

  const handleConfirm = () => {
    /* prototype: wire split API when available */
    onConfirm?.(currentItems, newItems, newShipmentId, currentShipmentId);
    onClose();
  };

  const centerSwap = (
    <Box
      sx={{
        width: 48,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        alignSelf: "stretch",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: "50%",
          width: "1px",
          bgcolor: "divider",
          transform: "translateX(-50%)",
        }}
      />
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", zIndex: 1, py: 2 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: "grey.200",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SwapHorizIcon sx={{ color: "text.secondary", fontSize: 22 }} />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      scroll="paper"
      slotProps={{ backdrop: { sx: { bgcolor: "rgba(0,0,0,0.5)" } } }}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 960,
          minHeight: 500,
          maxHeight: "calc(100% - 64px)",
          borderRadius: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      <StandardDialogTitle onClose={onClose}>Split Shipment</StandardDialogTitle>
      <Divider sx={{ flexShrink: 0 }} />
      <DialogContent
        sx={{
          pt: 3,
          px: 3,
          pb: 2,
          flex: "1 1 auto",
          minHeight: 420,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Stack direction="row" spacing={0} sx={{ flex: 1, minHeight: 0, alignItems: "stretch" }}>
          <Stack sx={{ flex: "1 1 0%", minWidth: 0, pr: 2 }} spacing={2}>
            <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
              <Typography variant="subtitle1" fontWeight={600} color="text.primary" sx={{ letterSpacing: "0.15px" }}>
                Current Shipment ({currentItems.length} items)
              </Typography>
              <Typography variant="body2" fontWeight={700} color="text.primary" sx={{ flexShrink: 0 }}>
                {joinShipmentDisplayRef(currentShipmentId)}
              </Typography>
            </Stack>
            <Stack spacing={1.5} sx={{ overflow: "auto", pr: 0.5, flex: 1, minHeight: 0 }}>
              {currentItems.map((item) => (
                <Paper
                  key={item.id}
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Box
                    component="img"
                    src={item.image}
                    alt=""
                    sx={{ width: 56, height: 56, borderRadius: 0.5, objectFit: "cover", flexShrink: 0 }}
                  />
                  <Typography variant="body2" fontWeight={500} sx={{ flex: "1 1 auto", minWidth: 0, lineHeight: 1.4 }}>
                    {item.title}
                  </Typography>
                  {item.movable ? (
                    <Button
                      size="small"
                      color="primary"
                      variant="outlined"
                      endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
                      onClick={() => moveToNew(item.id)}
                      sx={{
                        flexShrink: 0,
                        textTransform: "none",
                        fontWeight: 600,
                        minWidth: "auto",
                        px: 1,
                      }}
                    >
                      Move
                    </Button>
                  ) : null}
                </Paper>
              ))}
              {currentItems.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No items left in this shipment.
                </Typography>
              ) : null}
            </Stack>
          </Stack>

          {centerSwap}

          <Stack sx={{ flex: "1 1 0%", minWidth: 0, pl: 2 }} spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} flexWrap="wrap">
              <Typography variant="subtitle1" fontWeight={600} color="text.primary" sx={{ letterSpacing: "0.15px" }}>
                New Shipment
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ flexShrink: 0 }}>
                {newShipmentId === null ? <CircularProgress size={18} thickness={5} /> : null}
                <Typography variant="body2" fontWeight={700} color="text.primary">
                  {splitNewShipmentDisplayRef(newShipmentId)}
                </Typography>
              </Stack>
            </Stack>
            <Paper
              variant="outlined"
              sx={{
                flex: 1,
                minHeight: 280,
                display: "flex",
                flexDirection: "column",
                borderRadius: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
                overflow: "hidden",
              }}
            >
              {newItems.length === 0 ? (
                <Stack
                  flex={1}
                  alignItems="center"
                  justifyContent="center"
                  spacing={1.5}
                  sx={{ px: 3, py: 6 }}
                >
                  <Inventory2OutlinedIcon sx={{ fontSize: 32, color: "action.disabled" }} />
                  <Typography variant="body1" color="text.secondary" sx={{ letterSpacing: "0.15px" }}>
                    Ready for Items
                  </Typography>
                </Stack>
              ) : (
                <Stack spacing={1.5} sx={{ overflow: "auto", p: 1.5, flex: 1, minHeight: 0 }}>
                  {newItems.map((item) => (
                    <Paper
                      key={item.id}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        borderColor: "divider",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        bgcolor: "background.paper",
                      }}
                    >
                      <Box
                        component="img"
                        src={item.image}
                        alt=""
                        sx={{ width: 56, height: 56, borderRadius: 0.5, objectFit: "cover", flexShrink: 0 }}
                      />
                      <Typography variant="body2" fontWeight={500} sx={{ flex: "1 1 auto", minWidth: 0, lineHeight: 1.4 }}>
                        {item.title}
                      </Typography>
                      {item.movable ? (
                        <Button
                          size="small"
                          color="primary"
                          variant="outlined"
                          startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
                          onClick={() => moveToCurrent(item.id)}
                          sx={{
                            flexShrink: 0,
                            textTransform: "none",
                            fontWeight: 600,
                            minWidth: "auto",
                            px: 1,
                          }}
                        >
                          Move
                        </Button>
                      ) : null}
                    </Paper>
                  ))}
                </Stack>
              )}
            </Paper>
          </Stack>
        </Stack>
      </DialogContent>
      <Divider sx={{ flexShrink: 0 }} />
      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between", flexShrink: 0 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ ...DIALOG_CANCEL_BUTTON_SX, py: 1, px: 2.75 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!transferDirty}
          onClick={handleConfirm}
          sx={{ py: 1, px: 2.75 }}
        >
          Confirm & Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const CREATE_REMARK_MESSAGE_PLACEHOLDER = "Please write your message here";

function ItemRemarksDialog({
  open,
  onClose,
  itemId,
  messages,
}: {
  open: boolean;
  onClose: () => void;
  itemId: string;
  messages: ShipmentMessage[];
}) {
  const filteredMessages = useMemo(() => {
    return messages
      .filter((m) => m.itemId === itemId)
      .sort(compareShipmentMessagesNewestFirst);
  }, [messages, itemId]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 540,
          maxHeight: "calc(100% - 64px)",
          borderRadius: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      <StandardDialogTitle onClose={onClose}>Item Remarks</StandardDialogTitle>
      <Divider sx={{ flexShrink: 0 }} />
      <DialogContent
        sx={{
          px: 3,
          pt: 2,
          pb: 2,
          flex: "1 1 auto",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            flex: "1 1 auto",
            minHeight: 160,
            maxHeight: 360,
            overflow: "auto",
            width: "100%",
            minWidth: 0,
            boxSizing: "border-box",
          }}
        >
          {filteredMessages.length > 0 ? (
            filteredMessages.map((m) => <MessageRow key={m.id} message={m} />)
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              No remarks for this item yet.
            </Typography>
          )}
        </Box>
      </DialogContent>
      <Divider sx={{ flexShrink: 0 }} />
      <DialogActions sx={{ px: 3, py: 2, justifyContent: "flex-end", flexShrink: 0 }}>
        <Button variant="contained" color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function CreateRemarkDialog({
  open,
  onClose,
  defaultItemId,
  onSend,
}: {
  open: boolean;
  onClose: () => void;
  defaultItemId: string | null;
  onSend: (payload: { targetKey: string; remarkPreset: string; body: string }) => void;
}) {
  const [remarkPreset, setRemarkPreset] = useState("");
  const [applyScope, setApplyScope] = useState<string>("shipment");
  const [messageBody, setMessageBody] = useState("");

  useEffect(() => {
    if (open) {
      setRemarkPreset("");
      setApplyScope(defaultItemId ?? "shipment");
      setMessageBody("");
    }
  }, [open, defaultItemId]);

  const targetKey = defaultItemId ?? applyScope;

  const applyToLabel = (key: string) => {
    if (key === "shipment") return REMARK_ALL_PRODUCTS_LABEL;
    const meta = PACK_LINE_ITEM_META.find((x) => x.id === key);
    return meta?.itemListLabel ?? key;
  };

  const canSend = remarkPreset !== "";

  const handleSend = () => {
    if (!canSend) return;
    onSend({ targetKey, remarkPreset, body: messageBody.trim() });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 540,
          minHeight: 500,
          maxHeight: "calc(100% - 64px)",
          borderRadius: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      <StandardDialogTitle onClose={onClose}>Packing Remarks</StandardDialogTitle>
      <Divider sx={{ flexShrink: 0 }} />
      <DialogContent
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          flex: "1 1 auto",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <Stack spacing={3} sx={{ flex: "1 1 auto", minHeight: 0 }}>
          {defaultItemId ? (
            <Typography variant="body2" color="text.secondary">
              Applies to: {applyToLabel(defaultItemId)}
            </Typography>
          ) : (
            <FormControl fullWidth>
              <InputLabel id="create-remark-scope-label" shrink>
                Apply to
              </InputLabel>
              <Select
                labelId="create-remark-scope-label"
                id="create-remark-scope"
                label="Apply to"
                value={applyScope}
                onChange={(e: SelectChangeEvent<string>) => setApplyScope(e.target.value)}
              >
                <MenuItem value="shipment">{REMARK_ALL_PRODUCTS_LABEL}</MenuItem>
                {PACK_LINE_ITEM_META.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.itemListLabel}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <FormControl fullWidth>
            <InputLabel id="create-remark-preset-label" shrink>
              Select Remark
            </InputLabel>
            <Select
              labelId="create-remark-preset-label"
              id="create-remark-preset"
              label="Select Remark"
              value={remarkPreset}
              displayEmpty
              onChange={(e: SelectChangeEvent<string>) => setRemarkPreset(e.target.value)}
              renderValue={(v) =>
                v === "" ? (
                  <Typography component="span" variant="body1" color="text.disabled">
                    Select
                  </Typography>
                ) : (
                  v
                )
              }
              MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
            >
              <MenuItem value="" disabled>
                Select
              </MenuItem>
              {REMARK_PRESET_OPTIONS.map((label) => (
                <MenuItem key={label} value={label}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack spacing={1.5} sx={{ flex: "1 1 auto", minHeight: 0, display: "flex", flexDirection: "column" }}>
            <Typography variant="body1" color="text.primary" sx={{ letterSpacing: "0.15px", flexShrink: 0 }}>
              Message (optional):
            </Typography>
            <TextField
              multiline
              fullWidth
              placeholder={CREATE_REMARK_MESSAGE_PLACEHOLDER}
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              variant="outlined"
              inputProps={{ "aria-label": "Message text" }}
              sx={{
                flex: "1 1 auto",
                minHeight: 100,
                "& .MuiOutlinedInput-root": {
                  minHeight: 100,
                  height: "100%",
                  alignItems: "flex-start",
                  paddingTop: 1.25,
                  paddingBottom: 1.25,
                  boxSizing: "border-box",
                },
                "& textarea": {
                  minHeight: "72px !important",
                },
              }}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <Divider sx={{ flexShrink: 0 }} />
      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between", flexShrink: 0 }}>
        <Button variant="outlined" onClick={onClose} sx={DIALOG_CANCEL_BUTTON_SX}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!canSend}
          onClick={handleSend}
        >
          Send Message
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function CarrierShippingRouteDialog({
  open,
  onClose,
  activeRouteId,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  activeRouteId: string;
  onSave: (routeId: string) => void;
}) {
  const [pendingRouteId, setPendingRouteId] = useState(activeRouteId);

  useEffect(() => {
    if (open) {
      setPendingRouteId(activeRouteId);
    }
  }, [open, activeRouteId]);

  const currentRoute = findShippingRoute(activeRouteId) ?? SHIPPING_ROUTE_ROWS[0];
  const availableRoutes = SHIPPING_ROUTE_ROWS.filter((r) => r.id !== activeRouteId);
  const currentRouteSelected = pendingRouteId === activeRouteId;

  const handleSave = () => {
    if (!pendingRouteId || pendingRouteId === activeRouteId) return;
    onSave(pendingRouteId);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: {
          minHeight: 500,
          maxHeight: "calc(100% - 64px)",
        },
      }}
    >
      <StandardDialogTitle onClose={onClose}>Carrier Shipping Route</StandardDialogTitle>
      <Divider />
      <DialogContent sx={{ px: 3, pt: 3, pb: 2 }}>
        <Stack spacing={3}>
          <Box>
            <Typography fontWeight={600} color="text.primary" sx={{ mb: 1.5 }}>
              Current Route
            </Typography>
            <Box
              sx={{
                border: "2px solid",
                borderColor: currentRouteSelected ? "primary.main" : "divider",
                borderRadius: 1,
                px: 2,
                py: 1,
                boxSizing: "border-box",
                bgcolor: currentRouteSelected
                  ? (theme) => alpha(theme.palette.primary.main, 0.12)
                  : "background.paper",
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Radio
                  checked={currentRouteSelected}
                  size="small"
                  tabIndex={-1}
                  disableRipple
                  sx={{ p: 0.5, pointerEvents: "none" }}
                  icon={<RadioButtonUncheckedIcon sx={{ fontSize: 22, color: "action.active" }} />}
                  checkedIcon={
                    <CheckCircleIcon sx={{ fontSize: 22, color: "primary.main" }} />
                  }
                />
                <ShippingRouteColumnLabels route={currentRoute} />
              </Stack>
            </Box>
          </Box>
          <Box>
            <Typography fontWeight={600} color="text.primary" sx={{ mb: 1.5 }}>
              Available Routes
            </Typography>
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                overflow: "hidden",
                bgcolor: "background.paper",
              }}
            >
              <RadioGroup
                value={pendingRouteId === activeRouteId ? "" : pendingRouteId}
                onChange={(e) => setPendingRouteId(e.target.value)}
              >
                {availableRoutes.map((r, index) => {
                  const selected = pendingRouteId === r.id && pendingRouteId !== activeRouteId;
                  const isLast = index === availableRoutes.length - 1;
                  return (
                    <Box
                      key={r.id}
                      component="label"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        px: 2,
                        py: 1,
                        cursor: "pointer",
                        m: 0,
                        boxSizing: "border-box",
                        borderBottom: !isLast ? "1px solid" : "none",
                        borderColor: "divider",
                        ...(selected && {
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                          boxShadow: (theme) => `inset 0 0 0 2px ${theme.palette.primary.main}`,
                        }),
                      }}
                    >
                      <Radio
                        value={r.id}
                        size="small"
                        sx={{ p: 0.5 }}
                        icon={<RadioButtonUncheckedIcon sx={{ fontSize: 22, color: "action.active" }} />}
                        checkedIcon={
                          <CheckCircleIcon sx={{ fontSize: 22, color: "primary.main" }} />
                        }
                      />
                      <ShippingRouteColumnLabels route={r} />
                    </Box>
                  );
                })}
              </RadioGroup>
            </Box>
          </Box>
        </Stack>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
        <Button variant="outlined" onClick={onClose} sx={DIALOG_CANCEL_BUTTON_SX}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={pendingRouteId === activeRouteId}
          onClick={handleSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ---------------------------------------------------------------------------
 * Shipment recovery
 * Confirm → hub (check details / mark as sent) → manual creation on failure.
 * ------------------------------------------------------------------------- */

/** Inline alert styling, matching the Status card alerts. */
const RECOVERY_ALERT_WARNING_SX = {
  alignItems: "flex-start",
  py: 1.5,
  px: 2,
  borderRadius: 1,
  border: "none",
  boxShadow: "none",
  bgcolor: orange[50],
  color: "#663C00",
  "& .MuiAlert-icon": { color: "warning.main" },
  "& .MuiAlert-message": { width: "100%", pt: 0.125, color: "#663C00" },
} as const;

const RECOVERY_ALERT_ERROR_SX = {
  alignItems: "flex-start",
  py: 1.5,
  px: 2,
  borderRadius: 1,
  border: "none",
  boxShadow: "none",
  bgcolor: red[50],
  color: "#5F2120",
  "& .MuiAlert-icon": { color: "error.main" },
  "& .MuiAlert-message": { width: "100%", pt: 0.125, color: "#5F2120" },
} as const;

const RECOVERY_ALERT_TITLE_WARNING_SX = {
  fontWeight: 600,
  fontSize: 16,
  color: "#663C00",
  mb: 0.5,
  letterSpacing: "0.15px",
} as const;

const RECOVERY_ALERT_TITLE_ERROR_SX = {
  fontWeight: 600,
  fontSize: 16,
  color: "#5F2120",
  mb: 0.5,
  letterSpacing: "0.15px",
} as const;

/** Nested action/section card inside the recovery dialogs. */
const RECOVERY_CARD_SX = {
  p: 2,
  borderRadius: 1,
  borderColor: "divider",
  bgcolor: "background.paper",
} as const;

const RECOVERY_SECTION_TITLE_SX = {
  fontWeight: 700,
  fontSize: "1rem",
  color: "text.primary",
  letterSpacing: "0.15px",
} as const;

/** One action at a time, right-aligned, sized like the "Start shipment recovery" button. */
const RECOVERY_ACTION_BUTTON_SX = { py: 1, px: 3 } as const;

const RECOVERY_DETAIL_LABEL_SX = {
  width: 156,
  flexShrink: 0,
  fontSize: "0.875rem",
  fontWeight: 700,
  color: "text.primary",
} as const;

const RECOVERY_DETAIL_VALUE_SX = { letterSpacing: "0.15px", lineHeight: 1.5 } as const;

/**
 * Grey panel that holds a section's fields. The section title sits above it, so the
 * heading reads as a heading and the fields inside it as one group.
 */
const RECOVERY_SECTION_PANEL_SX = {
  bgcolor: "#fafafa",
  borderRadius: 1.5,
  p: 2,
} as const;

const RECOVERY_FIELD_LABEL_SX = {
  width: 156,
  flexShrink: 0,
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "text.primary",
  pt: 1.25,
} as const;

// Inputs keep a white surface so they stay legible on the grey section panel.
const RECOVERY_FIELD_SX = {
  "& .MuiOutlinedInput-root": { borderRadius: 1, bgcolor: "#fff" },
} as const;

const RECOVERY_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RECOVERY_DECIMAL_PATTERN = /^\d+(\.\d+)?$/;
const RECOVERY_INTEGER_PATTERN = /^\d+$/;

/** Live ZIP check against the pattern the localization service returned for the country. */
function isRecoveryZipValid(zip: string, rules: CountryAddressRules | null): boolean {
  const trimmed = zip.trim();
  if (!rules || !trimmed) return false;
  try {
    return new RegExp(rules.zipPattern).test(trimmed);
  } catch {
    // A malformed pattern from the service must not block the packer.
    return true;
  }
}

/**
 * Validated text row for the recovery form.
 *
 * This screen has no field-level validation precedent (no `error`/`helperText`
 * anywhere), so recovery standardises on this one wrapper rather than scattering
 * per-field markup. An error shows once the field is touched or has content.
 */
function RecoveryFormField({
  label,
  value,
  onChange,
  valid,
  touched = false,
  errorText,
  helperText,
  disabled = false,
  placeholder,
  optional = false,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  valid: boolean;
  /** Forces the error state even while empty; by default only filled-but-invalid shows red. */
  touched?: boolean;
  errorText?: string;
  helperText?: string;
  disabled?: boolean;
  placeholder?: string;
  optional?: boolean;
  inputMode?: "text" | "decimal" | "numeric" | "email" | "tel";
}) {
  const showError = !disabled && !valid && (touched || value.trim().length > 0);
  return (
    <Stack direction="row" alignItems="flex-start" spacing={2} sx={{ width: "100%" }}>
      <Typography sx={RECOVERY_FIELD_LABEL_SX}>
        {label}
        {optional ? (
          <Box component="span" sx={{ fontWeight: 400, color: "text.secondary" }}>
            {" "}
            (optional)
          </Box>
        ) : null}
      </Typography>
      <TextField
        fullWidth
        size="small"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        error={showError}
        helperText={showError ? errorText : helperText}
        inputProps={inputMode ? { inputMode } : undefined}
        sx={RECOVERY_FIELD_SX}
      />
    </Stack>
  );
}

/** Select row matching `RecoveryFormField`'s label column. */
function RecoverySelectField({
  label,
  value,
  onChange,
  options,
  disabled = false,
  placeholder = "Select",
  helperText,
  showError = false,
  errorText,
  endAdornment,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  options: readonly { value: string; label: string }[];
  disabled?: boolean;
  placeholder?: string;
  helperText?: string;
  showError?: boolean;
  errorText?: string;
  endAdornment?: ReactNode;
}) {
  return (
    <Stack direction="row" alignItems="flex-start" spacing={2} sx={{ width: "100%" }}>
      <Typography sx={RECOVERY_FIELD_LABEL_SX}>{label}</Typography>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1, minWidth: 0 }}>
        <FormControl fullWidth size="small" disabled={disabled} error={showError} sx={RECOVERY_FIELD_SX}>
          <Select
            value={value}
            displayEmpty
            onChange={(e: SelectChangeEvent<string>) => onChange(e.target.value)}
            renderValue={(v) =>
              v === "" ? (
                <Typography component="span" variant="body1" color="text.disabled">
                  {placeholder}
                </Typography>
              ) : (
                (options.find((o) => o.value === v)?.label ?? v)
              )
            }
            MenuProps={{ PaperProps: { sx: { maxHeight: 320 } } }}
          >
            <MenuItem value="" disabled>
              {placeholder}
            </MenuItem>
            {options.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </Select>
          {showError && errorText ? <FormHelperText>{errorText}</FormHelperText> : null}
          {!showError && helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
        </FormControl>
        {endAdornment}
      </Stack>
    </Stack>
  );
}

type RecoveryDetailsPhase = "idle" | "loading" | "loaded" | "noRecord";
type RecoveryMarkSentPhase = "idle" | "loading" | "facilityMismatch" | "noRecord" | "failed";

function ShipmentRecoveryHubDialog({
  open,
  barcode,
  scenario,
  actorName,
  currentFacilityId,
  onClose,
  onLog,
  onRecovered,
  onCreateManually,
}: {
  open: boolean;
  barcode: string;
  scenario: RecoveryScenario;
  actorName: string;
  currentFacilityId: string;
  onClose: () => void;
  onLog: (detail: string) => void;
  onRecovered: (orderId: string, shipmentId: string) => void;
  onCreateManually: (record: TgSupplierItemRecord | null) => void;
}) {
  const [detailsPhase, setDetailsPhase] = useState<RecoveryDetailsPhase>("idle");
  const [record, setRecord] = useState<TgSupplierItemRecord | null>(null);
  const [markSentPhase, setMarkSentPhase] = useState<RecoveryMarkSentPhase>("idle");
  const [mismatchFacilityName, setMismatchFacilityName] = useState("");

  useEffect(() => {
    if (!open) return;
    setDetailsPhase("idle");
    setRecord(null);
    setMarkSentPhase("idle");
    setMismatchFacilityName("");
  }, [open, barcode]);

  const handleCheckDetails = async () => {
    setDetailsPhase("loading");
    try {
      const found = await lookupTgSupplierItemFromApi(barcode, scenario);
      setRecord(found);
      setDetailsPhase(found ? "loaded" : "noRecord");
      onLog(
        found
          ? `Recovery: item details checked for barcode ${barcode} (${found.itemName}, order ${found.orderId}).`
          : `Recovery: item details check found no TG Supplier record for barcode ${barcode}.`,
      );
    } catch (e) {
      console.error(e);
      setDetailsPhase("noRecord");
      onLog(`Recovery: item details check failed for barcode ${barcode}.`);
    }
  };

  const handleMarkAsSent = async () => {
    setMarkSentPhase("loading");
    try {
      // Resolve the supplier facility before touching TG Supplier.
      const resolved = record ?? (await lookupTgSupplierItemFromApi(barcode, scenario));
      if (!resolved) {
        setRecord(null);
        setMarkSentPhase("noRecord");
        onLog(`Recovery: mark-as-sent aborted — no TG Supplier record for barcode ${barcode}.`);
        return;
      }
      setRecord(resolved);

      if (resolved.supplierFacilityId !== currentFacilityId) {
        setMismatchFacilityName(resolved.supplierFacilityName);
        setMarkSentPhase("facilityMismatch");
        onLog(
          `Recovery: mark-as-sent blocked — item ${resolved.itemName} belongs to ${resolved.supplierFacilityName}.`,
        );
        return;
      }

      await markItemSentInTgSupplierFromApi(barcode, actorName);
      onLog(`Recovery: item ${resolved.itemName} marked as sent in TG Supplier.`);

      const { shipmentId } = await triggerShipmentGenerationFromApi(resolved.orderId, {
        simulateFailure: scenario === "generationFailed",
      });
      onLog(`Recovery: shipment generation succeeded for order ${resolved.orderId} — ${shipmentId}.`);
      onRecovered(resolved.orderId, shipmentId);
    } catch (e) {
      const isGenerationFailure = e instanceof ShipmentGenerationError;
      if (!isGenerationFailure) console.error(e);
      setMarkSentPhase("failed");
      onLog(
        `Recovery: shipment generation failed${record ? ` for order ${record.orderId}` : ""} — manual creation required.`,
      );
    }
  };

  const detailsLoading = detailsPhase === "loading";
  const markSentLoading = markSentPhase === "loading";
  const busy = detailsLoading || markSentLoading;
  /** Either action can discover the barcode has no TG Supplier record. */
  const noRecordFound = detailsPhase === "noRecord" || markSentPhase === "noRecord";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      scroll="paper"
      slotProps={{ backdrop: { sx: { bgcolor: "rgba(0,0,0,0.5)" } } }}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 600,
          maxHeight: "calc(100% - 64px)",
          borderRadius: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      <StandardDialogTitle onClose={onClose}>Shipment recovery</StandardDialogTitle>
      <Divider sx={{ flexShrink: 0 }} />
      <DialogContent
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          flex: "1 1 auto",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <Stack spacing={2.5}>
          <Typography variant="body1" sx={{ color: "text.secondary", letterSpacing: "0.15px", lineHeight: 1.5 }}>
            No shipment was found for{" "}
            <Box component="span" sx={{ color: "text.primary", fontWeight: 600 }}>
              {barcode}
            </Box>
            .
            <br />
            If this item was scanned correctly, recover it with one of the actions below:
          </Typography>

          {/* Lookup result: order ID and the item's spec, titled above its panel. */}
          {detailsPhase === "loaded" && record ? (
            <Stack spacing={1}>
              <Typography variant="subtitle1" sx={RECOVERY_SECTION_TITLE_SX}>
                Item Details
              </Typography>
              <Stack spacing={1.5} sx={{ p: 2, borderRadius: 1.5, bgcolor: "#fafafa" }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 0.25, sm: 2 }}>
                  <Typography sx={RECOVERY_DETAIL_LABEL_SX}>Order ID:</Typography>
                  <Typography variant="body2" sx={RECOVERY_DETAIL_VALUE_SX}>
                    {record.orderId}
                  </Typography>
                </Stack>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 0.25, sm: 2 }}>
                  <Typography sx={RECOVERY_DETAIL_LABEL_SX}>Item Description:</Typography>
                  <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
                    {record.descriptionLines.map((line) => (
                      <Typography key={line} variant="body2" sx={RECOVERY_DETAIL_VALUE_SX}>
                        {line}
                      </Typography>
                    ))}
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          ) : null}

          {noRecordFound ? (
            <Alert
              severity="error"
              variant="standard"
              icon={<CancelOutlinedIcon />}
              sx={{ ...RECOVERY_ALERT_ERROR_SX, alignItems: "flex-start" }}
            >
              <AlertTitle sx={RECOVERY_ALERT_TITLE_ERROR_SX}>No TG Supplier record</AlertTitle>
              <Typography
                variant="body2"
                sx={{ letterSpacing: "0.15px", lineHeight: 1.43, color: "#5F2120", fontWeight: 500 }}
              >
                This is not a TG Supplier item label, so shipment recovery is not applicable. Check
                that you scanned the item label and not the packaging or container barcode.
              </Typography>
            </Alert>
          ) : null}

          {markSentPhase === "facilityMismatch" ? (
            <Alert
              severity="warning"
              variant="standard"
              icon={<ErrorOutlineIcon />}
              sx={{ ...RECOVERY_ALERT_WARNING_SX, alignItems: "flex-start" }}
            >
              <AlertTitle sx={RECOVERY_ALERT_TITLE_WARNING_SX}>Item is at another facility</AlertTitle>
              <Typography
                variant="body2"
                sx={{ letterSpacing: "0.15px", lineHeight: 1.43, color: "#663C00", fontWeight: 500 }}
              >
                This item belongs to another facility and must be transferred to be available for
                shipping.
                {mismatchFacilityName ? ` Currently held at ${mismatchFacilityName}.` : ""}
              </Typography>
            </Alert>
          ) : null}

          {markSentPhase === "failed" ? (
            <Alert
              severity="error"
              variant="standard"
              icon={<CancelOutlinedIcon />}
              sx={{ ...RECOVERY_ALERT_ERROR_SX, alignItems: "flex-start" }}
            >
              <AlertTitle sx={RECOVERY_ALERT_TITLE_ERROR_SX}>Shipment generation failed</AlertTitle>
              <Typography
                variant="body2"
                sx={{ letterSpacing: "0.15px", lineHeight: 1.43, color: "#5F2120", fontWeight: 500 }}
              >
                The item was marked as sent, but no shipment was generated. Create the shipment
                manually to keep packing.
              </Typography>
            </Alert>
          ) : null}

          {/*
            One action at a time, hugging its label on the right: the lookup first,
            then mark-as-sent once the details are on screen, then whatever the
            outcome leaves to do.
          */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            {markSentPhase === "failed" ? (
              // Generation failed: the manual escape hatch is all that is left.
              <Button
                variant="contained"
                color="warning"
                onClick={() => onCreateManually(record)}
                sx={{
                  ...RECOVERY_ACTION_BUTTON_SX,
                  // Only primary/secondary variants are pilled by the theme.
                  borderRadius: "50px",
                  "&:not(.Mui-disabled)": {
                    bgcolor: "#ed6c02",
                    color: "#fff",
                    "&:hover": { bgcolor: "#e65100" },
                  },
                }}
              >
                Create Manual Shipment
              </Button>
            ) : markSentPhase === "facilityMismatch" || noRecordFound ? (
              // Terminal outcomes: nothing here can recover the item.
              <Button variant="outlined" color="secondary" onClick={onClose} sx={RECOVERY_ACTION_BUTTON_SX}>
                Close
              </Button>
            ) : detailsPhase === "loaded" ? (
              <Button
                variant="contained"
                color="secondary"
                disabled={busy}
                onClick={() => void handleMarkAsSent()}
                startIcon={markSentLoading ? <CircularProgress size={18} color="inherit" /> : <CheckIcon />}
                sx={RECOVERY_ACTION_BUTTON_SX}
              >
                {markSentLoading ? "Working…" : "Mark As Sent"}
              </Button>
            ) : (
              <Button
                variant="outlined"
                color="secondary"
                disabled={busy}
                onClick={() => void handleCheckDetails()}
                startIcon={
                  detailsLoading ? <CircularProgress size={18} color="inherit" /> : <ManageSearchIcon />
                }
                sx={RECOVERY_ACTION_BUTTON_SX}
              >
                {detailsLoading ? "Checking…" : "Check Details"}
              </Button>
            )}
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Prototype only: one click fills the whole manual-shipment form with a valid
 * draft so a demo does not have to type twelve fields. Remove with the mock data.
 */
const MANUAL_SHIPMENT_MOCK_DRAFT = {
  orderId: "OR-772310",
  customerName: "Dana Cohen",
  customerEmail: "dana.cohen@example.com",
  customerPhone: "+1 415 555 0134",
  countryCode: "US",
  street1: "1200 Market Street",
  street2: "Apt 4B",
  city: "New York",
  stateProvince: "New York",
  zipCode: "10001",
  declaredShippingCost: "12.50",
  items: [
    { itemName: "Birthstone Ring — 14K Solid Gold", material: "14K Solid Gold", weight: "360", declaredValue: "27", quantity: "1" },
    { itemName: "Curb Chain Bracelet", material: "925 Sterling Silver", weight: "180", declaredValue: "42", quantity: "2" },
  ],
} as const;

function makeBlankManualItem(key: string): ManualShipmentItemDraft {
  return { key, itemName: "", material: "", hsCode: "", weight: "", declaredValue: "", quantity: "1" };
}

function isManualItemValid(item: ManualShipmentItemDraft): boolean {
  return (
    item.itemName.trim().length > 0 &&
    item.material.trim().length > 0 &&
    item.hsCode.trim().length > 0 &&
    RECOVERY_DECIMAL_PATTERN.test(item.weight.trim()) &&
    RECOVERY_DECIMAL_PATTERN.test(item.declaredValue.trim()) &&
    RECOVERY_INTEGER_PATTERN.test(item.quantity.trim()) &&
    Number(item.quantity) > 0
  );
}

/**
 * Last resort when shipment generation fails: hand-enter the shipment.
 * Reachable only from the generation-failure state in the recovery hub.
 */
function ManualShipmentCreationDialog({
  open,
  prefillOrderId,
  facilityId,
  onClose,
  onLog,
  onCreated,
}: {
  open: boolean;
  prefillOrderId: string;
  facilityId: string;
  onClose: () => void;
  onLog: (detail: string) => void;
  onCreated: (shipmentId: string, orderId: string) => void;
}) {
  const [orderId, setOrderId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [items, setItems] = useState<ManualShipmentItemDraft[]>([]);
  const [carrierServiceId, setCarrierServiceId] = useState("");
  const [declaredShippingCost, setDeclaredShippingCost] = useState("");

  const [rules, setRules] = useState<CountryAddressRules | null>(null);
  const [services, setServices] = useState<CarrierServiceOption[]>([]);
  const [countryLoading, setCountryLoading] = useState(false);
  const [facility, setFacility] = useState<FacilityConfig | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  /** Prototype only: true while the demo-fill button resolves country data. */
  const [fillingMock, setFillingMock] = useState(false);
  const itemKeyRef = useRef(0);

  useEffect(() => {
    if (!open) return;
    itemKeyRef.current = 1;
    setOrderId(prefillOrderId);
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setCountryCode("");
    setStreet1("");
    setStreet2("");
    setCity("");
    setStateProvince("");
    setZipCode("");
    setItems([makeBlankManualItem("manual-item-1")]);
    setCarrierServiceId("");
    setDeclaredShippingCost("");
    setRules(null);
    setServices([]);
    setSubmitError(null);
    setSubmitting(false);
  }, [open, prefillOrderId]);

  /** Facility details are read-only config, loaded once per open. */
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    void (async () => {
      try {
        const config = await loadFacilityConfigFromApi(facilityId);
        if (!cancelled) setFacility(config);
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, facilityId]);

  /** Country drives both the address rules and the carrier list. */
  useEffect(() => {
    if (!open) return;
    if (!countryCode) {
      setRules(null);
      setServices([]);
      return;
    }
    let cancelled = false;
    setCountryLoading(true);
    void (async () => {
      try {
        const [nextRules, nextServices] = await Promise.all([
          loadCountryAddressRulesFromApi(countryCode),
          loadCarrierServicesFromApi(facilityId, countryCode),
        ]);
        if (cancelled) return;
        setRules(nextRules);
        setServices(nextServices);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setRules(null);
          setServices([]);
        }
      } finally {
        if (!cancelled) setCountryLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, countryCode, facilityId]);

  const handleCountryChange = (next: string) => {
    setCountryCode(next);
    // Rules and available carriers both change with the country.
    setStateProvince("");
    setZipCode("");
    setCarrierServiceId("");
  };

  const patchItem = (key: string, patch: Partial<ManualShipmentItemDraft>) => {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...patch } : it)));
  };

  const handleMaterialChange = (key: string, material: string) => {
    // HS code auto-populates from the material and stays editable.
    patchItem(key, { material, hsCode: getHsCodeForMaterial(material) });
  };

  const handleAddItem = () => {
    itemKeyRef.current += 1;
    setItems((prev) => [...prev, makeBlankManualItem(`manual-item-${itemKeyRef.current}`)]);
  };

  const handleRemoveItem = (key: string) => {
    setItems((prev) => (prev.length <= 1 ? prev : prev.filter((it) => it.key !== key)));
  };

  /** Prototype only: fills every field with a valid draft for a demo. */
  const handleFillMockData = async () => {
    const mock = MANUAL_SHIPMENT_MOCK_DRAFT;
    setOrderId(mock.orderId);
    setCustomerName(mock.customerName);
    setCustomerEmail(mock.customerEmail);
    setCustomerPhone(mock.customerPhone);
    setStreet1(mock.street1);
    setStreet2(mock.street2);
    setCity(mock.city);
    setCountryCode(mock.countryCode);
    setItems(
      mock.items.map((it, idx) => {
        itemKeyRef.current = Math.max(itemKeyRef.current, idx + 1);
        return {
          ...makeBlankManualItem(`manual-item-${idx + 1}`),
          ...it,
          hsCode: getHsCodeForMaterial(it.material),
        };
      }),
    );
    setDeclaredShippingCost(mock.declaredShippingCost);
    setSubmitError(null);
    // State, ZIP and carrier depend on the country, so wait for its rules and services.
    setFillingMock(true);
    try {
      const [nextRules, nextServices] = await Promise.all([
        loadCountryAddressRulesFromApi(mock.countryCode),
        loadCarrierServicesFromApi(facilityId, mock.countryCode),
      ]);
      setRules(nextRules);
      setServices(nextServices);
      setStateProvince(mock.stateProvince);
      setZipCode(mock.zipCode);
      setCarrierServiceId(nextServices[0]?.id ?? "");
    } catch (e) {
      console.error(e);
    } finally {
      setFillingMock(false);
    }
  };

  const addressEnabled = Boolean(rules) && !countryLoading;
  const stateRequired = Boolean(rules?.stateRequired);
  const stateOptions = rules?.stateOptions ?? [];

  const orderIdValid = orderId.trim().length > 0;
  const nameValid = customerName.trim().length > 0;
  const emailValid = RECOVERY_EMAIL_PATTERN.test(customerEmail.trim());
  const phoneValid = customerPhone.trim().length > 0;
  const street1Valid = street1.trim().length > 0;
  const cityValid = city.trim().length > 0;
  const stateValid = !stateRequired || stateProvince.trim().length > 0;
  const zipValid = isRecoveryZipValid(zipCode, rules);
  const carrierValid = carrierServiceId.length > 0;
  const costValid = RECOVERY_DECIMAL_PATTERN.test(declaredShippingCost.trim());
  const itemsValid = items.length > 0 && items.every(isManualItemValid);

  const isFormValid =
    orderIdValid &&
    nameValid &&
    emailValid &&
    phoneValid &&
    addressEnabled &&
    street1Valid &&
    cityValid &&
    stateValid &&
    zipValid &&
    carrierValid &&
    costValid &&
    itemsValid;

  const handleSubmit = async () => {
    if (!isFormValid || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    const draft: ManualShipmentDraft = {
      orderId: orderId.trim(),
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      countryCode,
      street1: street1.trim(),
      street2: street2.trim(),
      city: city.trim(),
      state: stateProvince.trim(),
      zipCode: zipCode.trim(),
      items: items.map((it) => ({
        ...it,
        itemName: it.itemName.trim(),
        hsCode: it.hsCode.trim(),
        weight: it.weight.trim(),
        declaredValue: it.declaredValue.trim(),
        quantity: it.quantity.trim(),
      })),
      carrierServiceId,
      declaredShippingCost: declaredShippingCost.trim(),
    };
    try {
      const { shipmentId } = await createManualShipmentFromApi(draft);
      onLog(
        `Recovery: shipment ${shipmentId} created manually for order ${draft.orderId} ` +
          `(${draft.items.length} item${draft.items.length === 1 ? "" : "s"}, ${findCountryName(countryCode)}).`,
      );
      onCreated(shipmentId, draft.orderId);
    } catch (e) {
      console.error(e);
      setSubmitError("Could not create the shipment. Check the details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const countryOptions = RECOVERY_COUNTRY_OPTIONS.map((c) => ({ value: c.code, label: c.name }));
  const materialOptions = RECOVERY_MATERIAL_OPTIONS.map((m) => ({ value: m, label: m }));
  const carrierOptions = services.map((s) => ({ value: s.id, label: formatCarrierServiceDisplay(s) }));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      scroll="paper"
      slotProps={{ backdrop: { sx: { bgcolor: "rgba(0,0,0,0.5)" } } }}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 760,
          minHeight: 500,
          maxHeight: "calc(100% - 64px)",
          borderRadius: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      <StandardDialogTitle
        onClose={onClose}
        subtitle={
          <Typography variant="body2" color="text.secondary" sx={{ letterSpacing: "0.15px" }}>
            Shipment generation failed for this item — enter the details to create the shipment.
          </Typography>
        }
      >
        Create shipment manually
      </StandardDialogTitle>
      <Divider sx={{ flexShrink: 0 }} />
      <DialogContent
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          flex: "1 1 auto",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <Stack spacing={3}>
          {/* Order */}
          <Stack spacing={1}>
            <Typography variant="subtitle1" sx={RECOVERY_SECTION_TITLE_SX}>
              Order
            </Typography>
            <Box sx={RECOVERY_SECTION_PANEL_SX}>
              <RecoveryFormField
                label="Order ID"
                value={orderId}
                onChange={setOrderId}
                valid={orderIdValid}
                errorText="Order ID is required."
                placeholder="OR-000000"
              />
            </Box>
          </Stack>

          {/* Customer */}
          <Stack spacing={1}>
            <Typography variant="subtitle1" sx={RECOVERY_SECTION_TITLE_SX}>
              Customer
            </Typography>
            <Box sx={RECOVERY_SECTION_PANEL_SX}>
            <Stack spacing={2}>
            <RecoveryFormField
              label="Full name"
              value={customerName}
              onChange={setCustomerName}
              valid={nameValid}
              errorText="Full name is required."
            />
            <RecoveryFormField
              label="Email"
              value={customerEmail}
              onChange={setCustomerEmail}
              valid={emailValid}
              errorText="Enter a valid email address."
              inputMode="email"
            />
            <RecoveryFormField
              label="Phone"
              value={customerPhone}
              onChange={setCustomerPhone}
              valid={phoneValid}
              errorText="Phone is required."
              inputMode="tel"
            />
            </Stack>
            </Box>
          </Stack>

          {/* Address */}
          <Stack spacing={1}>
            <Typography variant="subtitle1" sx={RECOVERY_SECTION_TITLE_SX}>
              Address
            </Typography>
            <Box sx={RECOVERY_SECTION_PANEL_SX}>
            <Stack spacing={2}>
            <RecoverySelectField
              label="Country"
              value={countryCode}
              onChange={handleCountryChange}
              options={countryOptions}
              placeholder="Select a country"
              endAdornment={countryLoading ? <CircularProgress size={18} thickness={5} /> : null}
            />
            <RecoveryFormField
              label="Street address"
              value={street1}
              onChange={setStreet1}
              valid={street1Valid}
              errorText="Street address is required."
              disabled={!addressEnabled}
            />
            <RecoveryFormField
              label="Street address 2"
              value={street2}
              onChange={setStreet2}
              valid
              optional
              disabled={!addressEnabled}
            />
            <RecoveryFormField
              label="City"
              value={city}
              onChange={setCity}
              valid={cityValid}
              errorText="City is required."
              disabled={!addressEnabled}
            />
            {stateOptions.length > 0 ? (
              <RecoverySelectField
                label={stateRequired ? "State / Province" : "State / Province (optional)"}
                value={stateProvince}
                onChange={setStateProvince}
                options={stateOptions.map((s) => ({ value: s, label: s }))}
                disabled={!addressEnabled}
                showError={addressEnabled && stateRequired && stateProvince.trim().length === 0}
                errorText="State / Province is required for this country."
              />
            ) : (
              <RecoveryFormField
                label={stateRequired ? "State / Province" : "State / Province"}
                value={stateProvince}
                onChange={setStateProvince}
                valid={stateValid}
                errorText="State / Province is required for this country."
                optional={!stateRequired}
                disabled={!addressEnabled}
              />
            )}
            <RecoveryFormField
              label="ZIP / Postal code"
              value={zipCode}
              onChange={setZipCode}
              valid={zipValid}
              errorText={
                rules?.zipExample
                  ? `Does not match the format for ${findCountryName(countryCode)} (e.g. ${rules.zipExample}).`
                  : "Invalid postal code for this country."
              }
              disabled={!addressEnabled}
            />
            </Stack>
            </Box>
          </Stack>

          {/* Items */}
          <Stack spacing={1}>
            <Typography variant="subtitle1" sx={RECOVERY_SECTION_TITLE_SX}>
              Items
            </Typography>
            <Box sx={RECOVERY_SECTION_PANEL_SX}>
            <Stack spacing={2}>
            {items.map((item, idx) => (
              <Paper key={item.key} variant="outlined" elevation={0} sx={RECOVERY_CARD_SX}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, letterSpacing: "0.15px" }}>
                      Item {idx + 1}
                    </Typography>
                    {idx > 0 ? (
                      <Tooltip title="Remove item">
                        <IconButton
                          size="small"
                          aria-label={`Remove item ${idx + 1}`}
                          onClick={() => handleRemoveItem(item.key)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                  </Stack>
                  <RecoveryFormField
                    label="Item name"
                    value={item.itemName}
                    onChange={(v) => patchItem(item.key, { itemName: v })}
                    valid={item.itemName.trim().length > 0}
                    errorText="Item name is required."
                  />
                  <RecoverySelectField
                    label="Material"
                    value={item.material}
                    onChange={(v) => handleMaterialChange(item.key, v)}
                    options={materialOptions}
                    placeholder="Select a material"
                  />
                  <RecoveryFormField
                    label="HS code"
                    value={item.hsCode}
                    onChange={(v) => patchItem(item.key, { hsCode: v })}
                    valid={item.hsCode.trim().length > 0}
                    errorText="HS code is required."
                  />
                  <RecoveryFormField
                    label="Weight (g)"
                    value={item.weight}
                    onChange={(v) => patchItem(item.key, { weight: v })}
                    valid={RECOVERY_DECIMAL_PATTERN.test(item.weight.trim())}
                    errorText="Enter a number, e.g. 360."
                    inputMode="decimal"
                  />
                  <RecoveryFormField
                    label="Declared value"
                    value={item.declaredValue}
                    onChange={(v) => patchItem(item.key, { declaredValue: v })}
                    valid={RECOVERY_DECIMAL_PATTERN.test(item.declaredValue.trim())}
                    errorText="Enter a number, e.g. 27."
                    inputMode="decimal"
                  />
                  <RecoveryFormField
                    label="Quantity"
                    value={item.quantity}
                    onChange={(v) => patchItem(item.key, { quantity: v })}
                    valid={
                      RECOVERY_INTEGER_PATTERN.test(item.quantity.trim()) && Number(item.quantity) > 0
                    }
                    errorText="Enter a whole number of 1 or more."
                    inputMode="numeric"
                  />
                </Stack>
              </Paper>
            ))}
            <Button
              size="small"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddItem}
              sx={{ textTransform: "none", fontWeight: 600, alignSelf: "flex-start", px: 0.5 }}
            >
              Add another item
            </Button>
            </Stack>
            </Box>
          </Stack>

          {/* Shipping */}
          <Stack spacing={1}>
            <Typography variant="subtitle1" sx={RECOVERY_SECTION_TITLE_SX}>
              Shipping
            </Typography>
            <Box sx={RECOVERY_SECTION_PANEL_SX}>
            <Stack spacing={2}>
            <RecoverySelectField
              label="Carrier service"
              value={carrierServiceId}
              onChange={setCarrierServiceId}
              options={carrierOptions}
              disabled={!countryCode || countryLoading}
              placeholder={countryCode ? "Select a carrier service" : "Select a country first"}
              helperText={
                countryCode && !countryLoading && carrierOptions.length === 0
                  ? `No carrier services from ${facility?.name ?? facilityId} to ${findCountryName(countryCode)}.`
                  : undefined
              }
            />
            <RecoveryFormField
              label="Declared shipping cost"
              value={declaredShippingCost}
              onChange={setDeclaredShippingCost}
              valid={costValid}
              errorText="Enter a number, e.g. 12.50."
              inputMode="decimal"
            />
            </Stack>
            </Box>
          </Stack>

          {/* Facility (read-only) */}
          <Stack spacing={1}>
            <Typography variant="subtitle1" sx={RECOVERY_SECTION_TITLE_SX}>
              Facility details
            </Typography>
            <Box sx={RECOVERY_SECTION_PANEL_SX}>
              {facility ? (
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <FallbackPackCopyField label="Facility ID" value={facility.id} />
                  <FallbackPackCopyField label="Facility" value={facility.name} />
                  <FallbackPackCopyField
                    label="Address"
                    value={`${facility.addressLine}, ${facility.city}, ${facility.country}`}
                  />
                </Stack>
              ) : (
                <CircularProgress size={18} thickness={5} />
              )}
            </Box>
          </Stack>

          {submitError ? (
            <Alert severity="error" variant="standard" icon={<CancelOutlinedIcon />} sx={RECOVERY_ALERT_ERROR_SX}>
              <Typography
                variant="body2"
                sx={{ letterSpacing: "0.15px", lineHeight: 1.43, color: "#5F2120", fontWeight: 500 }}
              >
                {submitError}
              </Typography>
            </Alert>
          ) : null}
        </Stack>
      </DialogContent>
      <Divider sx={{ flexShrink: 0 }} />
      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between", flexShrink: 0, gap: 2 }}>
        <Button variant="outlined" onClick={onClose} sx={{ ...DIALOG_CANCEL_BUTTON_SX, py: 1, px: 2.75 }}>
          Cancel
        </Button>
        <Stack direction="row" alignItems="center" spacing={2}>
          {/* Prototype only: skips typing the form during a demo. */}
          <Button
            variant="outlined"
            color="secondary"
            disabled={fillingMock || submitting}
            onClick={() => void handleFillMockData()}
            startIcon={fillingMock ? <CircularProgress size={18} color="inherit" /> : <AutoFixHighIcon />}
            sx={{ py: 1, px: 2.75 }}
          >
            {fillingMock ? "Filling…" : "Fill mock data"}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            disabled={!isFormValid || submitting}
            onClick={() => void handleSubmit()}
            startIcon={
              submitting ? <CircularProgress size={18} color="inherit" sx={{ color: "#fff !important" }} /> : undefined
            }
            sx={{ py: 1, px: 2.75 }}
          >
            {submitting ? "Creating…" : "Create shipment"}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

/** Marks a line item that has not left production yet; cleared once "Item Sent" is ticked. */
function InProductionChip() {
  return (
    <Chip
      icon={<PrecisionManufacturingIcon sx={{ fontSize: "16px !important", color: "#663C00" }} />}
      label="In production"
      size="small"
      sx={{
        height: 26,
        fontWeight: 700,
        fontSize: 13,
        letterSpacing: "0.15px",
        color: "#663C00",
        bgcolor: orange[50],
        border: "1px solid",
        borderColor: alpha("#ed6c02", 0.4),
        "& .MuiChip-icon": { ml: "6px", mr: "-2px", color: "#663C00" },
        "& .MuiChip-label": { px: 0.75 },
      }}
    />
  );
}

function OtherFacilityLocationChip({ label }: { label: string }) {
  return (
    <Chip
      icon={<PlaceOutlinedIcon sx={{ fontSize: "18px !important", color: "text.primary" }} />}
      label={label}
      size="small"
      sx={{
        position: "absolute",
        left: 16,
        top: 0,
        zIndex: 1,
        transform: "translateY(-50%)",
        height: 28,
        pl: 0.5,
        pr: 1,
        fontWeight: 700,
        fontSize: 14,
        letterSpacing: "0.15px",
        color: "text.primary",
        bgcolor: "grey.200",
        border: "1px solid",
        borderColor: (theme) => alpha(theme.palette.common.black, 0.08),
        "& .MuiChip-icon": {
          ml: "6px",
          mr: "-2px",
          color: "text.primary",
        },
        "& .MuiChip-label": { px: 0.75 },
      }}
    />
  );
}

export default function ReadyToPack() {
  const theme = useTheme();
  const [orderInput, setOrderInput] = useState("");
  const [loadedOrderId, setLoadedOrderId] = useState<string | null>(null);
  /** After Split Shipment confirm, skip resetting `packItems` in the `loadedOrderId` effect (items already applied). */
  const skipPackItemsResetAfterSplitConfirmRef = useRef(false);
  /** Prototype: stack of order ids before opening pending (`fix`) via Next — Back restores the last one. */
  const [orderBrowseStack, setOrderBrowseStack] = useState<string[]>([]);
  const [notFoundQuery, setNotFoundQuery] = useState<string | null>(null);
  const [shipmentDetailsEditUnlocked, setShipmentDetailsEditUnlocked] = useState(false);
  const [trackingManualMode, setTrackingManualMode] = useState(false);
  const [manualTrackingInput, setManualTrackingInput] = useState("");
  const [trackingManualSaved, setTrackingManualSaved] = useState(false);
  /** True after a successful Tracking ID “Load” from API for the current manual session; reset when leaving manual or loading an order. */
  const manualTrackingLoadedFromApiRef = useRef(false);
  const [activeCarrierRouteId, setActiveCarrierRouteId] = useState(INITIAL_CARRIER_ROUTE_ID);
  const [carrierRouteDialogOpen, setCarrierRouteDialogOpen] = useState(false);
  const [savedShipmentAddress, setSavedShipmentAddress] = useState<AddressForm>({ ...DEFAULT_ADDRESS_FORM });
  const [destinationDisplay, setDestinationDisplay] = useState(() =>
    formatDestinationSummary(DEFAULT_ADDRESS_FORM),
  );
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [orderHistoryDialogOpen, setOrderHistoryDialogOpen] = useState(false);
  const [shipmentHistoryDialogOpen, setShipmentHistoryDialogOpen] = useState(false);
  const [sendToFixDialogOpen, setSendToFixDialogOpen] = useState(false);
  const [joinShipmentDialogOpen, setJoinShipmentDialogOpen] = useState(false);
  const [splitShipmentDialogOpen, setSplitShipmentDialogOpen] = useState(false);
  const [packItems, setPackItems] = useState<JoinTransferItem[]>(() =>
    buildSplitShipmentCurrentItems().map((x) => ({ ...x, movable: false })),
  );
  const [shipmentMessages, setShipmentMessages] = useState<ShipmentMessage[]>(() => buildInitialShipmentMessages());
  const [remarksTab, setRemarksTab] = useState<RemarksTabValue>("all");
  const [createRemarkOpen, setCreateRemarkOpen] = useState(false);
  const [createRemarkDefaultItemId, setCreateRemarkDefaultItemId] = useState<string | null>(null);
  const [itemRemarksItemId, setItemRemarksItemId] = useState<string | null>(null);
  const [moreActionsMenuAnchor, setMoreActionsMenuAnchor] = useState<null | HTMLElement>(null);
  const [prototypeDemoSearchMenuAnchor, setPrototypeDemoSearchMenuAnchor] = useState<null | HTMLElement>(null);
  const [onHoldStatusMenuAnchor, setOnHoldStatusMenuAnchor] = useState<null | HTMLElement>(null);
  const [packingOrderUiStatus, setPackingOrderUiStatus] = useState<PackingOrderUiStatus>("readyToPack");
  /** Prototype `fallback` search: Pack → loading → failed API (Figma 1762:35805). */
  const [fallbackPackSubmitPhase, setFallbackPackSubmitPhase] = useState<"idle" | "loading" | "failed">("idle");
  const [fallbackPackDialogOpen, setFallbackPackDialogOpen] = useState(false);
  const fallbackPackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Synchronous intent for `fallback-supervisor` loads — the `loadedOrderId` effect must not rely on batched `orderInput` (stale closure). */
  const prototypeFallbackSupervisorLoadRef = useRef(false);
  const [packSuccessAnimNonce, setPackSuccessAnimNonce] = useState(0);
  const [packButtonLayout, setPackButtonLayout] = useState<"v1" | "v2" | "v3">("v1");
  const [sentToFixReason, setSentToFixReason] = useState<string | null>(null);
  /** After OK/Cancel, hide the pending notice until `loadedOrderId` changes again. */
  const [pendingShipmentDialogDismissed, setPendingShipmentDialogDismissed] = useState(false);
  /** Prototype similar orders: which tab is active (Figma 2314:30804). */
  const [similarOrdersTabIndex, setSimilarOrdersTabIndex] = useState(SIMILAR_ORDER_CURRENT_SHIPMENT_TAB_INDEX);
  /** Prototype split orders: which linked shipment tab is active (original vs new). */
  const [splitOrdersTabIndex, setSplitOrdersTabIndex] = useState(0);
  /** After Split Shipment dialog confirm: concrete original + new shipment ids for tabs; search `split` uses prototype rows. */
  const [splitLinkedPair, setSplitLinkedPair] = useState<{ original: string; split: string } | null>(null);
  /** Per-tab line items after a completed split dialog; null for search-only `split` prototype. */
  const [splitTabInventories, setSplitTabInventories] = useState<{
    original: JoinTransferItem[];
    newShipment: JoinTransferItem[];
  } | null>(null);
  /** Shipment recovery: which outcome the current not-found query simulates; null outside recovery. */
  const [recoveryScenario, setRecoveryScenario] = useState<RecoveryScenario | null>(null);
  const [recoveryHubOpen, setRecoveryHubOpen] = useState(false);
  const [manualShipmentDialogOpen, setManualShipmentDialogOpen] = useState(false);
  /** Order ID prefilled into manual creation, taken from the TG Supplier lookup when available. */
  const [manualShipmentPrefillOrderId, setManualShipmentPrefillOrderId] = useState("");
  /** Success toast shown once a recovered shipment loads; null hides it. */
  const [recoverySuccessToast, setRecoverySuccessToast] = useState<string | null>(null);
  /** Line items still in production; ticking "Item sent" releases them for shipment. */
  const [inProductionItemIds, setInProductionItemIds] = useState<string[]>([]);
  /** Item ids currently mid-release, so the checkbox can show progress and block double submits. */
  const [inProductionSendingItemIds, setInProductionSendingItemIds] = useState<string[]>([]);
  /** Shipment history is append-only at runtime; recovery actions are recorded here. */
  const [shipmentHistoryEntries, setShipmentHistoryEntries] = useState<HistoryLogEntry[]>(
    () => [...SHIPMENT_HISTORY_LOG],
  );
  /**
   * Recovery ends by loading the recovered shipment, which runs the `loadedOrderId`
   * reset and would otherwise wipe the entries recovery just wrote. These carry across
   * that one load; cleared by any ordinary search.
   */
  const recoveryHistoryCarryRef = useRef<HistoryLogEntry[]>([]);
  /** On-hold only: item IDs at another facility until Kiriyat Gat marks received (Figma 1744:42531). */
  const [remoteFacilityItemIds, setRemoteFacilityItemIds] = useState<string[]>([]);
  /** Line items marked received from another facility — rendered at bottom in this order, not in fixed meta slots. */
  const [remoteReceivedPackOrder, setRemoteReceivedPackOrder] = useState<string[]>([]);
  const [otherFacilitiesSectionExpanded, setOtherFacilitiesSectionExpanded] = useState(true);
  /** Prototype: header profile toggles Hungary vs Kiryat Gat packing layout. */
  const [prototypeFactorySiteView, setPrototypeFactorySiteView] = useState<"kiryatGat" | "hungary">("kiryatGat");
  /** Prototype: packer vs supervisor (supervisor unlocks Fallback Pack on fallback retry UI). */
  const [prototypeAccountRole, setPrototypeAccountRole] = useState<"packer" | "supervisor">("packer");
  const [userProfileMenuAnchor, setUserProfileMenuAnchor] = useState<HTMLElement | null>(null);
  const [machineName, setMachineName] = useState("");
  const [machinePopoverAnchor, setMachinePopoverAnchor] = useState<HTMLElement | null>(null);
  const [machineInputValue, setMachineInputValue] = useState("");
  const { isFullscreen, toggleFullscreen } = useLayout();
  /** Prototype-only: index into PROTOTYPE_BRAND_LOGOS, advanced by clicking the header logo. */
  const [brandLogoIndex, setBrandLogoIndex] = useState(0);
  const brandLogo = PROTOTYPE_BRAND_LOGOS[brandLogoIndex];
  /** Assign-storage flow — per line item, the confirmed cell/container assignment. */
  const [storageAssignByItemId, setStorageAssignByItemId] = useState<
    Record<string, StorageAssignment>
  >({});
  /** Item id whose "Assign storage" popup is currently open (only one at a time), or null. */
  const [assignStoragePopupItemId, setAssignStoragePopupItemId] = useState<string | null>(null);
  /** Why this shipment is on hold — drives the Assign storage modal subtitle. Defaults to the awaiting-items case. */
  const [holdReasonState, setHoldReasonState] = useState<HoldReasonState>("awaiting_items");
  /** Whether the shipment-level "Release shipment" modal is open (hold-lastitem demo). */
  const [releaseShipmentModalOpen, setReleaseShipmentModalOpen] = useState(false);
  /** PROTOTYPE ONLY — which release-modal example to show; click the card(s) to toggle. */
  const [releaseExampleVariant, setReleaseExampleVariant] = useState<"single" | "multi">("single");
  /** PROTOTYPE ONLY — advance to the next hold-reason state (subtitle is clickable to preview all three). */
  const cycleHoldReasonState = () =>
    setHoldReasonState((prev) => {
      const idx = HOLD_STATE_PREVIEW_OPTIONS.findIndex((o) => o.value === prev);
      return HOLD_STATE_PREVIEW_OPTIONS[(idx + 1) % HOLD_STATE_PREVIEW_OPTIONS.length].value;
    });

  const orderPacked = packingOrderUiStatus === "packed";
  const orderShipped = packingOrderUiStatus === "shipped";
  const isPackActionsBlocked = isPackingStatusBlockingActions(packingOrderUiStatus);
  const isSortingStationView =
    isSortingStationOrderId(loadedOrderId) || isRobotStationOrderId(loadedOrderId);
  /** Robot prototype only: container row shows “Robot” / “Cell 27” instead of sort-station copy. */
  const robotCellAssignUi = isRobotStationOrderId(loadedOrderId);
  const isSimilarMultipleOrdersView = isPrototypeSimilarMultipleOrdersId(loadedOrderId);
  const isSimilarOrdersView = isPrototypeSimilarLinkedOrdersId(loadedOrderId);
  const isSplitOrdersView = isPrototypeSplitOrdersId(loadedOrderId);
  const isFallbackPrototype = isPrototypeFallbackOrderId(loadedOrderId);
  const showShipmentLevelInstructionsPanel = isPrototypeInstructionShipmentLevelOrderId(loadedOrderId);
  /** Item-level instructions prototype: demo the first item with multiple instructions. */
  const showItemLevelMultiInstructionsDemo = isPrototypeInstructionItemLevelOrderId(loadedOrderId);
  const hideInlineItemPackingInstructions = showShipmentLevelInstructionsPanel;
  const sidebarSingleColumnMd = showShipmentLevelInstructionsPanel;
  const showFallbackPackButton =
    isFallbackPrototype &&
    packingOrderUiStatus === "packApiFailed" &&
    fallbackPackSubmitPhase === "failed" &&
    prototypeAccountRole === "supervisor";
  /** On-hold + sorting: per-line container row (sorting = “Scan to Assign” until scanned; on-hold skips gift kit). */
  const showItemContainerAssignRow = packingOrderUiStatus === "onHold" || isSortingStationView;

  const splitOrderTabsResolved = useMemo((): SplitOrderTabRow[] => {
    if (!isSplitOrdersView) return [];
    const factory = prototypeFactorySiteView === "hungary" ? "HU" : "KG";
    if (splitLinkedPair) {
      return [
        {
          key: "split-linked-original",
          shipmentId: splitLinkedPair.original,
          factoryLabel: factory,
          orderNumber: "5847219",
        },
        {
          key: "split-linked-new",
          shipmentId: splitLinkedPair.split,
          factoryLabel: factory,
          orderNumber: "5847220",
        },
      ];
    }
    return SPLIT_ORDER_PROTOTYPE_TABS.map((r) => ({
      ...r,
      factoryLabel: factory,
    }));
  }, [isSplitOrdersView, splitLinkedPair, prototypeFactorySiteView]);

  const similarOrderTabsResolved = useMemo(
    () => (isSimilarMultipleOrdersView ? SIMILAR_MULTIPLE_ORDER_TABS : SIMILAR_ORDER_TABS),
    [isSimilarMultipleOrdersView],
  );
  const similarShipmentTabIndex = Math.min(
    similarOrdersTabIndex,
    Math.max(0, similarOrderTabsResolved.length - 1),
  );
  const splitShipmentTabIndex = Math.min(
    splitOrdersTabIndex,
    Math.max(0, splitOrderTabsResolved.length - 1),
  );
  const similarOrderDetailIndex = isSimilarOrdersView ? similarShipmentTabIndex : 0;
  const activeSimilarOrder =
    isSimilarOrdersView && similarOrderTabsResolved[similarOrderDetailIndex]
      ? similarOrderTabsResolved[similarOrderDetailIndex]
      : similarOrderTabsResolved[0];
  const activeSplitOrder =
    isSplitOrdersView && splitOrderTabsResolved[splitShipmentTabIndex]
      ? splitOrderTabsResolved[splitShipmentTabIndex]
      : null;

  const displayedShipmentId = isSimilarOrdersView
    ? activeSimilarOrder.shipmentId
    : isSplitOrdersView && activeSplitOrder
      ? activeSplitOrder.shipmentId
      : "SH-12345";
  const displayedOrderNumberForDetails =
    isSimilarOrdersView && loadedOrderId
      ? activeSimilarOrder.orderNumber
      : isSplitOrdersView && loadedOrderId && activeSplitOrder
        ? activeSplitOrder.orderNumber
        : isPrototypeManualPackOrderId(loadedOrderId) ||
            isPrototypeInstructionItemLevelOrderId(loadedOrderId) ||
            isPrototypeInstructionShipmentLevelOrderId(loadedOrderId)
          ? "5847219"
          : isPrototypeFallbackOrderId(loadedOrderId)
            ? "30238941234"
            : loadedOrderId;
  const joinDialogShipmentId =
    isSimilarOrdersView && loadedOrderId
      ? activeSimilarOrder.shipmentId
      : isSplitOrdersView && loadedOrderId && activeSplitOrder
        ? activeSplitOrder.shipmentId
        : isPrototypeManualPackOrderId(loadedOrderId) ||
            isPrototypeFallbackOrderId(loadedOrderId) ||
            isPrototypeInstructionItemLevelOrderId(loadedOrderId) ||
            isPrototypeInstructionShipmentLevelOrderId(loadedOrderId)
          ? "SH-12345"
          : loadedOrderId ?? "";

  /** Similar orders: tab 0 full list; tab 1+ preview lines per linked shipment. Split: dialog inventories or default prototype second tab. */
  const packItemsResolved = useMemo(() => {
    if (isSimilarMultipleOrdersView && similarShipmentTabIndex === 2) {
      return [SIMILAR_MULTIPLE_THIRD_TAB_ITEM];
    }
    if (isSimilarOrdersView && similarShipmentTabIndex === 1) {
      return [SIMILAR_ORDER_SECOND_TAB_ITEM];
    }
    if (isSplitOrdersView && !splitTabInventories && splitShipmentTabIndex === 1) {
      return [SPLIT_PROTOTYPE_SECOND_TAB_ITEM];
    }
    if (!isSplitOrdersView || !splitTabInventories) return packItems;
    return splitShipmentTabIndex === 0 ? splitTabInventories.original : splitTabInventories.newShipment;
  }, [
    isSimilarOrdersView,
    isSimilarMultipleOrdersView,
    similarShipmentTabIndex,
    isSplitOrdersView,
    splitTabInventories,
    splitShipmentTabIndex,
    packItems,
  ]);

  const packItemCount = packItemsResolved.length;
  const visiblePackItemIds = useMemo(() => new Set(packItemsResolved.map((i) => i.id)), [packItemsResolved]);
  const showPackLine = (lineId: string) =>
    visiblePackItemIds.has(lineId) && !remoteReceivedPackOrder.includes(lineId);
  const showPackLine0 = showPackLine(PACK_LINE_ITEM_META[0].id);
  const showPackLine1 = showPackLine(PACK_LINE_ITEM_META[1].id);
  const showPackLine2 = showPackLine(PACK_LINE_ITEM_META[2].id);
  const visibleRemoteReceivedIdsOrdered = useMemo(
    () => remoteReceivedPackOrder.filter((rid) => visiblePackItemIds.has(rid)),
    [remoteReceivedPackOrder, visiblePackItemIds],
  );
  const extraPackItems = useMemo(
    () => packItemsResolved.filter((i) => !PACK_LINE_ITEM_META.some((meta) => meta.id === i.id)),
    [packItemsResolved],
  );

  const hungaryFactoryDemoActive =
    prototypeFactorySiteView === "hungary" &&
    !isSimilarOrdersView &&
    !isSplitOrdersView &&
    !isSortingStationView &&
    packingOrderUiStatus !== "onHold" &&
    packingOrderUiStatus !== "cancelled" &&
    packingOrderUiStatus !== "pending";

  const remoteFacilityIdsForUi = hungaryFactoryDemoActive
    ? [...HUNGARY_DEMO_OTHER_FACILITY_LINE_IDS]
    : remoteFacilityItemIds;

  // Hold-reason subtitle for the Assign storage modal. For the awaiting-items case, source the
  // count + facility from the items still in other facilities on this shipment.
  const awaitingItemCount = remoteFacilityIdsForUi.length || 1;
  const awaitingFacilityName =
    (remoteFacilityIdsForUi.length > 0
      ? PROTOTYPE_REMOTE_FACILITY_LOCATION_BY_ITEM_ID[remoteFacilityIdsForUi[0]]
      : undefined) ?? "Nazareth";
  const holdReasonMessage = formatHoldReasonMessage(
    holdReasonState,
    awaitingItemCount,
    awaitingFacilityName,
  );
  const releaseLocations =
    releaseExampleVariant === "single" ? RELEASE_EXAMPLE_SINGLE : RELEASE_EXAMPLE_MULTI;

  const showOtherFacilitiesSection =
    !isSimilarOrdersView &&
    !isSplitOrdersView &&
    remoteFacilityIdsForUi.length > 0 &&
    (packingOrderUiStatus === "onHold" ||
      hungaryFactoryDemoActive ||
      (packingOrderUiStatus === "readyToPack" && isPrototypeOnHoldOrderId(loadedOrderId)));

  const showPackLine0Ui = hungaryFactoryDemoActive
    ? visiblePackItemIds.has(PACK_LINE_ITEM_META[0].id) &&
      !remoteReceivedPackOrder.includes(PACK_LINE_ITEM_META[0].id)
    : showPackLine0;
  const showPackLine1Ui = hungaryFactoryDemoActive ? false : showPackLine1;
  const showPackLine2Ui = hungaryFactoryDemoActive ? false : showPackLine2;
  const anyPrimaryPackLineVisibleUi = showPackLine0Ui || showPackLine1Ui || showPackLine2Ui;
  const extraPackItemsUi = hungaryFactoryDemoActive ? [] : extraPackItems;
  const packItemCountUi = hungaryFactoryDemoActive ? 1 : packItemCount;
  const visibleRemoteReceivedIdsOrderedUi = hungaryFactoryDemoActive ? [] : visibleRemoteReceivedIdsOrdered;

  /** Other similar-order tab: prefill join dialog source column when opening from the pair UI. */
  const joinPrefillSourceShipmentId = useMemo(() => {
    if (!isSimilarOrdersView || isSimilarMultipleOrdersView || similarOrderTabsResolved.length < 2) {
      return null;
    }
    const otherIndex = similarShipmentTabIndex === 0 ? 1 : 0;
    return similarOrderTabsResolved[otherIndex].shipmentId;
  }, [isSimilarOrdersView, isSimilarMultipleOrdersView, similarOrderTabsResolved, similarShipmentTabIndex]);
  const activeRoute = findShippingRoute(activeCarrierRouteId) ?? SHIPPING_ROUTE_ROWS[0];
  const activeCarrierLogoSrc = findCarrierLogoSrc(activeRoute);
  /** Non-primary tab on split or similar-order pair: preview only — no pack column or reviewed checkbox (tab 0 packs). */
  const isLinkedOrderNonPrimaryTab =
    (isSplitOrdersView && splitShipmentTabIndex !== 0) ||
    (isSimilarOrdersView && similarShipmentTabIndex !== 0);
  /** Hide pack checkbox + pack / send-to-fix / more-actions (sorting station is view-only for pack flow). */
  const hidePackActionsUi =
    isPackActionsBlocked || isSortingStationView || isLinkedOrderNonPrimaryTab || orderShipped;
  const packingStatusChip = getPackingStatusChipConfig(packingOrderUiStatus, theme);
  const StatusChipIcon = packingStatusChip.Icon;
  const ReadyToPackStatusIcon = getPackingStatusChipConfig("readyToPack", theme).Icon;
  const onHoldStatusMenuOpen = Boolean(onHoldStatusMenuAnchor);
  const userProfileMenuOpen = Boolean(userProfileMenuAnchor);

  const headerProfileDisplayName =
    prototypeAccountRole === "supervisor"
      ? PROTOTYPE_SUPERVISOR_DISPLAY_NAME
      : prototypeFactorySiteView === "hungary"
        ? "James Smith"
        : "John Doe";
  const headerProfileRoleLabel = `${prototypeAccountRole === "supervisor" ? "Supervisor" : "Packer"} · ${prototypeFactorySiteView === "hungary" ? "HU" : "KG"}`;

  const moreActionsMenuItems = orderPacked ? MORE_ACTIONS_MENU_ITEMS_PACKED : MORE_ACTIONS_MENU_ITEMS_DEFAULT;

  /**
   * Barcode shown in the recovery dialogs. Demo keywords carry a plausible item-label
   * barcode; anything else falls back to what was actually searched.
   */
  const recoveryBarcode = recoveryScenario
    ? getScenarioBarcode(recoveryScenario)
    : (notFoundQuery ?? "");

  const filteredRemarksMessages = useMemo(() => {
    return shipmentMessages
      .filter((m) => remarksTab === "all" || m.channel === remarksTab)
      .sort(compareShipmentMessagesNewestFirst);
  }, [shipmentMessages, remarksTab]);

  const remarkCountByItemId = useMemo(() => {
    const map: Record<string, number> = {};
    for (const m of shipmentMessages) {
      if (m.itemId) map[m.itemId] = (map[m.itemId] ?? 0) + 1;
    }
    return map;
  }, [shipmentMessages]);

  const isEmptyState = loadedOrderId === null;
  const isInitialScanScreen = isEmptyState && notFoundQuery === null;
  /** Nothing to clear on the untouched scan screen. */
  const showClearSearchButton =
    orderInput.trim().length > 0 || loadedOrderId !== null || notFoundQuery !== null;

  const showShipmentPendingDialog =
    isPrototypePendingOrderId(loadedOrderId) && !pendingShipmentDialogDismissed;

  useEffect(() => {
    setPendingShipmentDialogDismissed(false);
  }, [loadedOrderId]);

  useEffect(() => {
    return () => {
      if (fallbackPackTimerRef.current) {
        clearTimeout(fallbackPackTimerRef.current);
        fallbackPackTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (fallbackPackTimerRef.current) {
      clearTimeout(fallbackPackTimerRef.current);
      fallbackPackTimerRef.current = null;
    }
    setPackSuccessAnimNonce(0);
    setFallbackPackSubmitPhase("idle");
    const isFixQueue = isPrototypePendingOrderId(loadedOrderId);
    const isCancelledProto = isPrototypeCancelledOrderId(loadedOrderId);
    const isOnHoldProto = isPrototypeOnHoldOrderId(loadedOrderId);
    const isHoldLastItemProto = isPrototypeHoldLastItemOrderId(loadedOrderId);
    const isSortStationProto = isSortingStationOrderId(loadedOrderId);
    const isRobotStationProto = isRobotStationOrderId(loadedOrderId);
    const isPackedProto = isPrototypePackedOrderId(loadedOrderId);
    const isShippedProto = isPrototypeShippedOrderId(loadedOrderId);
    if (isCancelledProto) {
      setPackingOrderUiStatus("cancelled");
      setSentToFixReason(null);
    } else if (isFixQueue) {
      setPackingOrderUiStatus("pending");
      setSentToFixReason(PROTOTYPE_PENDING_SENT_TO_FIX_BODY);
    } else if (isOnHoldProto || isHoldLastItemProto || isSortStationProto || isRobotStationProto) {
      setPackingOrderUiStatus("onHold");
      setSentToFixReason(null);
    } else if (isPackedProto) {
      setPackingOrderUiStatus("packed");
      setSentToFixReason(null);
    } else if (isShippedProto) {
      setPackingOrderUiStatus("shipped");
      setSentToFixReason(null);
    } else {
      setPackingOrderUiStatus("readyToPack");
      setSentToFixReason(null);
    }
    if (
      loadedOrderId !== null &&
      isPrototypeFallbackOrderId(loadedOrderId) &&
      prototypeFallbackSupervisorLoadRef.current
    ) {
      setPackingOrderUiStatus("packApiFailed");
      setFallbackPackSubmitPhase("failed");
    }
    setShipmentDetailsEditUnlocked(false);
    setTrackingManualMode(false);
    setManualTrackingInput("");
    setTrackingManualSaved(false);
    manualTrackingLoadedFromApiRef.current = false;
    setActiveCarrierRouteId(INITIAL_CARRIER_ROUTE_ID);
    setCarrierRouteDialogOpen(false);
    setSavedShipmentAddress({ ...DEFAULT_ADDRESS_FORM });
    setDestinationDisplay(formatDestinationSummary(DEFAULT_ADDRESS_FORM));
    setAddressDialogOpen(false);
    setOrderHistoryDialogOpen(false);
    setSendToFixDialogOpen(false);
    setJoinShipmentDialogOpen(false);
    setSplitShipmentDialogOpen(false);
    setShipmentMessages(buildInitialShipmentMessages());
    const carriedRecoveryHistory = recoveryHistoryCarryRef.current;
    recoveryHistoryCarryRef.current = [];
    setShipmentHistoryEntries([...carriedRecoveryHistory, ...SHIPMENT_HISTORY_LOG]);
    setInProductionItemIds(
      isPrototypeInProductionOrderId(loadedOrderId) ? [...PROTOTYPE_IN_PRODUCTION_ITEM_IDS] : [],
    );
    setInProductionSendingItemIds([]);
    setRemarksTab("all");
    setCreateRemarkOpen(false);
    setCreateRemarkDefaultItemId(null);
    setItemRemarksItemId(null);
    setMoreActionsMenuAnchor(null);
    setOnHoldStatusMenuAnchor(null);
    setSimilarOrdersTabIndex(SIMILAR_ORDER_CURRENT_SHIPMENT_TAB_INDEX);
    setSplitOrdersTabIndex(0);
    if (!isPrototypeSplitOrdersId(loadedOrderId)) {
      setSplitLinkedPair(null);
      setSplitTabInventories(null);
    }
    if (isPrototypeManualPackOrderId(loadedOrderId)) {
      setTrackingManualMode(true);
      setShipmentDetailsEditUnlocked(true);
      setManualTrackingInput(PROTOTYPE_MANUAL_PACK_TRACKING_DEMO);
    }
    setPrototypeFactorySiteView("kiryatGat");
    const useSupervisorForFallbackDemo =
      loadedOrderId !== null &&
      isPrototypeFallbackOrderId(loadedOrderId) &&
      prototypeFallbackSupervisorLoadRef.current;
    setPrototypeAccountRole(useSupervisorForFallbackDemo ? "supervisor" : "packer");
    const base = buildSplitShipmentCurrentItems().map((x) => ({ ...x, movable: false }));
    if (isOnHoldProto) {
      setRemoteFacilityItemIds([...PROTOTYPE_ON_HOLD_REMOTE_FACILITY_ITEM_IDS]);
      setPackItems(base.filter((i) => !PROTOTYPE_ON_HOLD_REMOTE_FACILITY_ITEM_IDS.includes(i.id)));
      setRemoteReceivedPackOrder([]);
      setOtherFacilitiesSectionExpanded(true);
    } else {
      setRemoteFacilityItemIds([]);
      setRemoteReceivedPackOrder([]);
      if (skipPackItemsResetAfterSplitConfirmRef.current) {
        skipPackItemsResetAfterSplitConfirmRef.current = false;
      } else {
        const firstLineId = PACK_LINE_ITEM_META[0].id;
        setPackItems(
          isPrototypeInstructionItemLevelOrderId(loadedOrderId) || isRobotStationOrderId(loadedOrderId)
            ? base.filter((i) => i.id === firstLineId)
            : base,
        );
      }
    }
    // hold-lastitem: the first jewelry line is already stored (CELL 148); the second is still unassigned.
    setStorageAssignByItemId(
      isHoldLastItemProto
        ? { [PACK_LINE_ITEM_META[0].id]: { kind: "cell", cell: PROTOTYPE_HOLD_LAST_ITEM_ASSIGNED_CELL } }
        : {},
    );
    // On-hold: auto-open the popup for the first visible assignable line (skip remote-facility lines + gift kit).
    const firstAssignableLineId =
      PACK_LINE_ITEM_META.find(
        (m) =>
          m.id !== PACK_LINE_ITEM_META[2].id &&
          !PROTOTYPE_ON_HOLD_REMOTE_FACILITY_ITEM_IDS.includes(m.id),
      )?.id ?? null;
    setAssignStoragePopupItemId(isOnHoldProto ? firstAssignableLineId : null);
    // hold-lastitem: the last physical item is up for release → auto-open the Release shipment modal.
    setReleaseShipmentModalOpen(isHoldLastItemProto);
    setReleaseExampleVariant("single");
  }, [loadedOrderId]);

  const handleOpenAssignStorage = (assignItemId: string) => {
    setAssignStoragePopupItemId(assignItemId);
  };

  const handleCloseAssignStorage = () => {
    setAssignStoragePopupItemId(null);
  };

  /** Release shipment confirm — all items collected → lift the hold and move to Ready to Pack. */
  const handleReleaseShipmentConfirm = () => {
    setReleaseShipmentModalOpen(false);
    setPackingOrderUiStatus("readyToPack");
  };

  /** PROTOTYPE ONLY — toggle the release modal between the single-cell and multi-location examples. */
  const cycleReleaseExample = () =>
    setReleaseExampleVariant((variant) => (variant === "single" ? "multi" : "single"));

  /** Attach-to-cell API confirmation — assigns the suggested cell (shipment status unchanged). */
  const handleConfirmCellAssign = (assignItemId: string, cell: number) => {
    setStorageAssignByItemId((prev) => ({ ...prev, [assignItemId]: { kind: "cell", cell } }));
    setAssignStoragePopupItemId(null);
  };

  /** Scan-to-container API confirmation — assigns the scanned container (shipment status unchanged). */
  const handleConfirmContainerAssign = (assignItemId: string, barcode: string) => {
    setStorageAssignByItemId((prev) => ({ ...prev, [assignItemId]: { kind: "container", barcode } }));
    setAssignStoragePopupItemId(null);
  };

  /** Release/detach API — returns the item to unassigned; shipment status is untouched. */
  const handleReleaseStorage = (assignItemId: string) => {
    setStorageAssignByItemId((prev) => {
      const next = { ...prev };
      delete next[assignItemId];
      return next;
    });
  };

  const handleRemoteFacilityItemReceived = (itemId: string) => {
    const full = buildSplitShipmentCurrentItems().find((i) => i.id === itemId);
    if (!full) return;
    setPackItems((prev) => {
      if (prev.some((i) => i.id === itemId)) return prev;
      return [...prev, { ...full, movable: false }];
    });
    setRemoteReceivedPackOrder((prev) => (prev.includes(itemId) ? prev : [...prev, itemId]));
    setRemoteFacilityItemIds((prev) => prev.filter((id) => id !== itemId));
  };

  const handleRemoteFacilityReceivedChange = (itemId: string, checked: boolean) => {
    if (!PROTOTYPE_ON_HOLD_REMOTE_FACILITY_ITEM_IDS.includes(itemId)) return;
    if (checked) {
      handleRemoteFacilityItemReceived(itemId);
      return;
    }
    setRemoteReceivedPackOrder((prev) => prev.filter((id) => id !== itemId));
    const returnToOtherFacilities =
      packingOrderUiStatus === "onHold" ||
      (packingOrderUiStatus === "readyToPack" && isPrototypeOnHoldOrderId(loadedOrderId));
    if (returnToOtherFacilities) {
      setPackItems((prev) => prev.filter((p) => p.id !== itemId));
      setRemoteFacilityItemIds((prev) => (prev.includes(itemId) ? prev : [...prev, itemId]));
    }
  };

  const remoteFacilityItemReceivedControl = (itemId: string): ReactNode => {
    if (prototypeFactorySiteView === "hungary") return null;
    if (!isPrototypeOnHoldOrderId(loadedOrderId)) return null;
    if (!PROTOTYPE_ON_HOLD_REMOTE_FACILITY_ITEM_IDS.includes(itemId)) return null;
    return (
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            color="info"
            checked={remoteReceivedPackOrder.includes(itemId)}
            onChange={(_, checked) => handleRemoteFacilityReceivedChange(itemId, checked)}
            sx={{ py: 0.5 }}
          />
        }
        label={
          <Typography variant="body1" sx={{ fontSize: 16, letterSpacing: "0.15px" }}>
            Item Received
          </Typography>
        }
        sx={{ m: 0, mr: 0, gap: 0.5, alignItems: "center" }}
      />
    );
  };

  const openCreateRemarkDialog = (defaultItemId: string | null) => {
    setCreateRemarkDefaultItemId(defaultItemId);
    setCreateRemarkOpen(true);
  };

  const openItemRemarksDialog = (itemId: string) => {
    setItemRemarksItemId(itemId);
  };

  const handleCreateRemarkSend = ({
    targetKey,
    remarkPreset,
    body,
  }: {
    targetKey: string;
    remarkPreset: string;
    body: string;
  }) => {
    const now = new Date().toISOString();
    const itemLabel =
      targetKey === "shipment"
        ? REMARK_ALL_PRODUCTS_LABEL
        : (PACK_LINE_ITEM_META.find((x) => x.id === targetKey)?.itemListLabel ?? "Item");
    const messageBodyText = body.trim() ? `${remarkPreset}\n\n${body.trim()}` : remarkPreset;
    setShipmentMessages((prev) => [
      {
        id:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `msg-${Date.now()}`,
        at: now,
        author: "You",
        senderRole: "packer",
        channel: "packing",
        body: messageBodyText,
        itemId: targetKey === "shipment" ? null : targetKey,
        itemLabel,
      },
      ...prev,
    ]);
  };

  /**
   * Appends an audit entry to the shipment log, attributed to the acting user.
   * `source` doubles as the actor in `HistoryLogEntry`, so the name goes there.
   */
  const appendShipmentHistory = (detail: string, options?: { carryAcrossLoad?: boolean }) => {
    const entry: HistoryLogEntry = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `hist-${Date.now()}`,
      at: formatHistoryTimestamp(new Date()),
      source: headerProfileDisplayName,
      detail,
    };
    setShipmentHistoryEntries((prev) => [entry, ...prev]);
    if (options?.carryAcrossLoad) {
      recoveryHistoryCarryRef.current = [entry, ...recoveryHistoryCarryRef.current];
    }
  };

  /** Recovery actions must survive the load into the recovered shipment. */
  const appendRecoveryHistory = (detail: string) =>
    appendShipmentHistory(detail, { carryAcrossLoad: true });

  /**
   * Explicit user action from the not-found state — never triggered by the lookup
   * itself. Opens the recovery actions directly; there is no confirmation step.
   */
  const handleStartShipmentRecovery = () => {
    if (!HAS_SHIPMENT_RECOVERY_PERMISSION) return;
    // A plain not-found query has no scenario; default the demo to the happy path.
    if (recoveryScenario === null) setRecoveryScenario("happyPath");
    setRecoveryHubOpen(true);
    appendRecoveryHistory(`Recovery: shipment recovery started for barcode ${recoveryBarcode}.`);
  };

  /** Generation succeeded — drop into the normal shipment details view. */
  const handleRecoveryCompleted = (
    orderId: string,
    shipmentId: string,
    outcome: "generated" | "createdManually" = "generated",
  ) => {
    setRecoveryHubOpen(false);
    setManualShipmentDialogOpen(false);
    setRecoveryScenario(null);
    setNotFoundQuery(null);
    setOrderInput(orderId);
    appendRecoveryHistory(`Recovery: shipment ${shipmentId} loaded for packing.`);
    setLoadedOrderId(PROTOTYPE_PACK_ORDER_ID);
    // Survives the load above — the reset effect deliberately leaves it alone.
    setRecoverySuccessToast(
      outcome === "createdManually"
        ? `Shipment ${shipmentId} created — ready to pack.`
        : `Shipment ${shipmentId} recovered — ready to pack.`,
    );
  };

  const handleOpenManualShipmentCreation = (record: TgSupplierItemRecord | null) => {
    setManualShipmentPrefillOrderId(record?.orderId ?? "");
    setRecoveryHubOpen(false);
    setManualShipmentDialogOpen(true);
  };

  const handleManualShipmentCreated = (shipmentId: string, orderId: string) => {
    handleRecoveryCompleted(orderId, shipmentId, "createdManually");
  };

  /**
   * In-production release: mark the item sent in TG Supplier, then fire the same
   * generation trigger the QA "sent" event uses. On success the row becomes
   * available for shipment.
   */
  const handleInProductionItemSentChange = async (itemId: string, checked: boolean) => {
    if (!checked || !HAS_SHIPMENT_RECOVERY_PERMISSION) return;
    if (inProductionSendingItemIds.includes(itemId)) return;
    const itemLabel = PACK_LINE_ITEM_META.find((m) => m.id === itemId)?.title ?? itemId;
    setInProductionSendingItemIds((prev) => [...prev, itemId]);
    try {
      await markItemSentInTgSupplierFromApi(itemId, headerProfileDisplayName);
      appendShipmentHistory(`In-production release: ${itemLabel} marked as sent in TG Supplier.`);
      await triggerShipmentGenerationFromApi(itemId);
      setInProductionItemIds((prev) => prev.filter((id) => id !== itemId));
      appendShipmentHistory(`In-production release: ${itemLabel} is now available for shipment.`);
    } catch (e) {
      console.error(e);
      appendShipmentHistory(`In-production release failed for ${itemLabel}.`);
    } finally {
      setInProductionSendingItemIds((prev) => prev.filter((id) => id !== itemId));
    }
  };

  /**
   * "Item sent" control, mirroring `remoteFacilityItemReceivedControl`: only for the
   * in-production prototype, only for items still in production, and only when the
   * item sits in the current packing facility.
   */
  const inProductionItemSentControl = (itemId: string): ReactNode => {
    if (!HAS_SHIPMENT_RECOVERY_PERMISSION) return null;
    if (!isPrototypeInProductionOrderId(loadedOrderId)) return null;
    if (!inProductionItemIds.includes(itemId)) return null;
    if (getInProductionItemFacilityId(itemId) !== CURRENT_PACKING_FACILITY_ID) return null;
    const sending = inProductionSendingItemIds.includes(itemId);
    return (
      <Stack direction="row" alignItems="center" spacing={1}>
        <InProductionChip />
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              color="info"
              checked={false}
              disabled={sending}
              onChange={(_, checked) => void handleInProductionItemSentChange(itemId, checked)}
              sx={{ py: 0.5 }}
            />
          }
          label={
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Typography variant="body1" sx={{ fontSize: 16, letterSpacing: "0.15px" }}>
                Item Sent
              </Typography>
              {sending ? <CircularProgress size={14} thickness={5} /> : null}
            </Stack>
          }
          sx={{ m: 0, mr: 0, gap: 0.5, alignItems: "center" }}
        />
      </Stack>
    );
  };

  const handleLoadOrderFromInput = (raw: string) => {
    const trimmed = raw.trim();
    setOrderInput(trimmed);
    // An ordinary search abandons any in-flight recovery, so its log entries stop here.
    recoveryHistoryCarryRef.current = [];
    const id = normalizeOrderIdForLoad(trimmed);
    const queryKey = stripLeadingHashSearchPrefix(trimmed).toLowerCase();
    if (!id) {
      prototypeFallbackSupervisorLoadRef.current = false;
      setLoadedOrderId(null);
      setNotFoundQuery(null);
      setOrderBrowseStack([]);
      return;
    }
    if (isNoShipmentsQuery(id)) {
      prototypeFallbackSupervisorLoadRef.current = false;
      setLoadedOrderId(null);
      setNotFoundQuery(id);
      setOrderBrowseStack([]);
      // Set synchronously here rather than in the [loadedOrderId] effect, which does
      // not re-run for not-found queries and would read a stale batched `orderInput`.
      const scenario = resolveRecoveryScenario(id);
      setRecoveryScenario(scenario);
      setManualShipmentDialogOpen(false);
      // The scenario only arms the demo; the hub opens from "Start shipment recovery".
      setRecoveryHubOpen(false);
      return;
    }
    setRecoveryScenario(null);
    setRecoveryHubOpen(false);
    setManualShipmentDialogOpen(false);
    prototypeFallbackSupervisorLoadRef.current =
      id === PROTOTYPE_FALLBACK_ORDER_ID &&
      (queryKey === PROTOTYPE_FALLBACK_SUPERVISOR_SEARCH || queryKey === "fallback_supervisor");
    setNotFoundQuery(null);
    setOrderBrowseStack([]);
    setLoadedOrderId(id);
    if (id === PROTOTYPE_SPLIT_ORDER_ID) {
      setSplitLinkedPair(null);
      setSplitTabInventories(null);
    }
  };

  const handleLoadOrder = () => {
    handleLoadOrderFromInput(orderInput);
  };

  /** Clears the search and returns the screen to the initial scan state. */
  const handleClearSearch = () => {
    prototypeFallbackSupervisorLoadRef.current = false;
    recoveryHistoryCarryRef.current = [];
    setOrderInput("");
    setNotFoundQuery(null);
    setOrderBrowseStack([]);
    setRecoveryScenario(null);
    setRecoveryHubOpen(false);
    setManualShipmentDialogOpen(false);
    // Clearing `loadedOrderId` runs the reset effect, which restores the rest.
    setLoadedOrderId(null);
  };

  const handleNextOrder = () => {
    setNotFoundQuery(null);
    prototypeFallbackSupervisorLoadRef.current = false;
    if (loadedOrderId) {
      setOrderBrowseStack((s) => [...s, loadedOrderId]);
    }
    const nextId = getNextPrototypeCycleOrderId(loadedOrderId);
    setOrderInput(nextId);
    setLoadedOrderId(nextId);
  };

  const handlePreviousOrder = () => {
    if (orderBrowseStack.length === 0) return;
    prototypeFallbackSupervisorLoadRef.current = false;
    const prev = orderBrowseStack[orderBrowseStack.length - 1];
    setOrderBrowseStack((s) => s.slice(0, -1));
    setOrderInput(prev);
    setLoadedOrderId(prev);
  };

  const handleShipmentPendingOk = () => {
    setPendingShipmentDialogDismissed(true);
    setPackingOrderUiStatus("readyToPack");
    setSentToFixReason(null);
    setTrackingManualMode(true);
    setShipmentDetailsEditUnlocked(true);
    setManualTrackingInput(PROTOTYPE_MANUAL_PACK_TRACKING_DEMO);
    manualTrackingLoadedFromApiRef.current = false;
  };

  const handleShipmentPendingCancel = () => {
    setPendingShipmentDialogDismissed(true);
    if (orderBrowseStack.length > 0) {
      handlePreviousOrder();
    } else {
      prototypeFallbackSupervisorLoadRef.current = false;
      setLoadedOrderId(null);
      setOrderInput("");
      setNotFoundQuery(null);
      setOrderBrowseStack([]);
    }
  };

  const startFallbackPackApiSimulation = () => {
    if (fallbackPackTimerRef.current) {
      clearTimeout(fallbackPackTimerRef.current);
      fallbackPackTimerRef.current = null;
    }
    setPackingOrderUiStatus("readyToPack");
    setFallbackPackSubmitPhase("loading");
    fallbackPackTimerRef.current = setTimeout(() => {
      fallbackPackTimerRef.current = null;
      setFallbackPackSubmitPhase("failed");
      setPackingOrderUiStatus("packApiFailed");
    }, 1600);
  };

  return (
    <Box
      data-node-id="2001:19492"
      sx={{
        minHeight: "100vh",
        bgcolor: "#f9f9fb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          ...elevationSx,
          bgcolor: "background.paper",
          minHeight: 72,
          top: isFullscreen ? 0 : 56,
          zIndex: 2,
          justifyContent: "center",
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            px: 3,
            minHeight: 56,
            py: 0.5,
            boxSizing: "border-box",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {/* Left: brand logo + search + nav buttons */}
          <Stack direction="row" alignItems="center" spacing={4} sx={{ minWidth: 0 }}>
            <Tooltip title="Switch brand (prototype)">
              <Box
                component="img"
                src={brandLogo.src}
                alt={brandLogo.alt}
                onClick={() =>
                  setBrandLogoIndex((i) => (i + 1) % PROTOTYPE_BRAND_LOGOS.length)
                }
                sx={{
                  height: 32,
                  width: "auto",
                  display: "block",
                  flexShrink: 0,
                  cursor: "pointer",
                }}
              />
            </Tooltip>
            <Paper
              elevation={0}
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                pr: 1.5,
                py: 0,
                minHeight: 48,
                bgcolor: "background.paper",
                minWidth: 600,
                boxSizing: "border-box",
              }}
            >
              <Stack direction="row" alignItems="center" sx={{ width: "100%", minWidth: 0 }}>
                <TextField
                  variant="standard"
                  value={orderInput}
                  onChange={(e) => setOrderInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleLoadOrder();
                    }
                  }}
                  placeholder={isInitialScanScreen ? ORDER_SEARCH_PLACEHOLDER : undefined}
                  autoFocus={isInitialScanScreen}
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mr: 0 }}>
                        <NumbersIcon sx={{ fontSize: 20, color: "text.secondary", mr: 0.5 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        {showClearSearchButton ? (
                          <Tooltip title="Clear search">
                            <IconButton
                              size="small"
                              aria-label="Clear search"
                              onClick={handleClearSearch}
                              sx={{ mr: 0.25 }}
                            >
                              <CloseIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                          </Tooltip>
                        ) : null}
                        <Tooltip
                          title={
                            orderInput.trim()
                              ? "Demo search keywords (press Enter to search)"
                              : "Search or pick a demo keyword"
                          }
                        >
                          <IconButton
                            size="small"
                            edge="end"
                            aria-label="Open demo search keywords"
                            aria-haspopup="menu"
                            aria-controls="prototype-demo-search-menu"
                            aria-expanded={Boolean(prototypeDemoSearchMenuAnchor)}
                            onClick={(e) => {
                              setPrototypeDemoSearchMenuAnchor((prev) =>
                                prev ? null : e.currentTarget,
                              );
                            }}
                          >
                            <SearchIcon />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                    sx: { px: 1.5, py: 0, width: "100%", minWidth: 350, alignItems: "center" },
                  }}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    "& .MuiInputBase-input": { py: 0.5, fontSize: 15 },
                    "& .MuiInputBase-input::placeholder": {
                      opacity: 1,
                      color: "action.disabled",
                    },
                  }}
                />
                <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: "divider" }} />
                <Stack direction="row" spacing={0.5} sx={{ pl: 0.5 }}>
                  <Tooltip title="View Order Details">
                    <Box component="span" sx={{ display: "inline-flex" }}>
                      <IconButton size="small" aria-label="View Order Details" disabled={isEmptyState}>
                        <ListAltIcon />
                      </IconButton>
                    </Box>
                  </Tooltip>
                  <Tooltip title="Back order">
                    <Box component="span" sx={{ display: "inline-flex" }}>
                      <IconButton
                        size="small"
                        aria-label="Back order"
                        disabled={orderBrowseStack.length === 0}
                        onClick={handlePreviousOrder}
                      >
                        <ArrowBackIcon />
                      </IconButton>
                    </Box>
                  </Tooltip>
                  <Tooltip title="Next order">
                    <Box component="span" sx={{ display: "inline-flex" }}>
                      <IconButton size="small" aria-label="Next order" onClick={handleNextOrder}>
                        <ArrowForwardIcon />
                      </IconButton>
                    </Box>
                  </Tooltip>
                </Stack>
              </Stack>
            </Paper>
          </Stack>

          {/* Right: fullscreen + order manager + machine chip + user info */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip title={isFullscreen ? "Exit fullscreen" : "Fullscreen mode"}>
              <IconButton size="medium" aria-label="Toggle fullscreen" onClick={toggleFullscreen}>
                {isFullscreen ? <FullscreenExitIcon /> : <ScreenshotMonitorIcon />}
              </IconButton>
            </Tooltip>
            <Chip
              icon={<LaptopIcon sx={{ fontSize: 18, color: indigo[900] }} />}
              label={machineName || "Set Machine"}
              deleteIcon={<KeyboardArrowDownIcon sx={{ fontSize: 16, color: indigo[900] }} />}
              onDelete={(e) => {
                setMachineInputValue(machineName);
                setMachinePopoverAnchor(e.currentTarget);
              }}
              onClick={(e) => {
                setMachineInputValue(machineName);
                setMachinePopoverAnchor(e.currentTarget);
              }}
              sx={{
                bgcolor: indigo[50],
                color: indigo[900],
                border: "none",
                height: "auto",
                borderRadius: "50px",
                py: "4px",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 500,
                letterSpacing: "0.00714em",
                "& .MuiChip-label": { px: "12px" },
                "& .MuiChip-icon": { color: indigo[900], ml: "10px" },
                "& .MuiChip-deleteIcon": { color: indigo[900], "&:hover": { color: indigo[700] } },
                "&.MuiChip-clickable": { bgcolor: indigo[50] },
                "&.MuiChip-clickable:hover": { bgcolor: indigo[100] },
                "&.MuiChip-clickable:active": { bgcolor: indigo[50] },
              }}
            />
            <Popover
              open={Boolean(machinePopoverAnchor)}
              anchorEl={machinePopoverAnchor}
              onClose={() => setMachinePopoverAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              slotProps={{ paper: { sx: { p: 2, width: 280, borderRadius: 1.5, mt: 0.5 } } }}
            >
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
                <Typography variant="body2" fontWeight={500}>Set Machine</Typography>
                <IconButton size="small" onClick={() => setMachinePopoverAnchor(null)}>
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Stack>
              <TextField
                size="small"
                fullWidth
                placeholder="Machine name"
                value={machineInputValue}
                onChange={(e) => setMachineInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setMachineName(machineInputValue.trim());
                    setMachinePopoverAnchor(null);
                  }
                }}
                autoFocus
                InputProps={{
                  endAdornment: machineInputValue ? (
                    <InputAdornment position="end">
                      <IconButton size="small" edge="end" onClick={() => setMachineInputValue("")}>
                        <CloseIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                }}
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  size="small"
                  variant="contained"
                  disabled={!machineInputValue.trim()}
                  onClick={() => {
                    setMachineName(machineInputValue.trim());
                    setMachinePopoverAnchor(null);
                  }}
                >
                  Save
                </Button>
              </Box>
            </Popover>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ height: 40, borderColor: "divider" }}
              style={{ marginLeft: 16, marginRight: 16 }}
            />
            <Stack direction="row" alignItems="center" spacing={1.25} style={{ marginLeft: 0 }}>
              <ButtonBase
                id="header-user-profile-trigger"
                aria-controls={userProfileMenuOpen ? "header-user-profile-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={userProfileMenuOpen ? "true" : undefined}
                aria-label="Open account menu"
                onClick={(e) => setUserProfileMenuAnchor(e.currentTarget)}
                sx={{ borderRadius: 1, px: 0.5, py: 0.25 }}
              >
                <Stack sx={{ minWidth: 0, alignItems: "flex-start" }}>
                  <Stack direction="row" alignItems="center" spacing={0.25}>
                    <Typography variant="body2" fontWeight={500} sx={{ lineHeight: 1.35 }}>
                      {headerProfileDisplayName}
                    </Typography>
                    <KeyboardArrowDownIcon
                      sx={{
                        fontSize: 16,
                        color: "text.secondary",
                        transition: (muiTheme) => muiTheme.transitions.create("transform"),
                        transform: userProfileMenuOpen ? "rotate(180deg)" : "none",
                      }}
                    />
                  </Stack>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    onClick={(e) => { e.stopPropagation(); setPrototypeAccountRole((r) => (r === "packer" ? "supervisor" : "packer")); }}
                    sx={{ display: "block", lineHeight: 1.35, cursor: "pointer", "&:hover": { color: "text.primary" } }}
                  >
                    {headerProfileRoleLabel}
                  </Typography>
                </Stack>
              </ButtonBase>
              <Menu
                id="header-user-profile-menu"
                anchorEl={userProfileMenuAnchor}
                open={userProfileMenuOpen}
                onClose={() => setUserProfileMenuAnchor(null)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                slotProps={{ paper: { sx: { minWidth: 160, borderRadius: 1.5, mt: 0.5 } } }}
              >
                <MenuItem
                  dense
                  onClick={() => {
                    setUserProfileMenuAnchor(null);
                    setLoadedOrderId(null);
                    setOrderInput("");
                  }}
                  sx={{ color: "error.main" }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Log out
                </MenuItem>
              </Menu>
            </Stack>
          </Stack>
        </Toolbar>
        <Menu
          id="prototype-demo-search-menu"
          anchorEl={prototypeDemoSearchMenuAnchor}
          open={Boolean(prototypeDemoSearchMenuAnchor)}
          onClose={() => setPrototypeDemoSearchMenuAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{ paper: { sx: { minWidth: 220, maxWidth: 320 } } }}
        >
          <ListSubheader
            disableSticky
            sx={{ typography: "caption", color: "text.secondary", lineHeight: 1.4, py: 1, px: 2 }}
          >
            Tap a keyword to run search.{" "}
            <Box component="span" sx={{ fontFamily: "ui-monospace, monospace" }}>
              fallback-supervisor
            </Box>{" "}
            opens the fallback flow as supervisor (Elena) at Kiryat Gat; you can also use the header toggles.
          </ListSubheader>
          {PROTOTYPE_SEARCH_KEYWORDS.map((kw) => (
            <MenuItem
              key={kw}
              dense
              onClick={() => {
                setPrototypeDemoSearchMenuAnchor(null);
                handleLoadOrderFromInput(kw);
              }}
              sx={{ fontFamily: "ui-monospace, monospace", fontSize: 14 }}
            >
              {kw}
            </MenuItem>
          ))}
        </Menu>
      </AppBar>

      {loadedOrderId ? (
      <Box
        sx={{
          alignSelf: "stretch",
          width: "100%",
          maxWidth: 1600,
          mx: "auto",
          px: { xs: 2, md: 3 },
          py: 3,
          pb: 6,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          alignItems: "stretch",
        }}
      >
        <Paper
          elevation={1}
          sx={{
            width: "100%",
            maxWidth: "100%",
            alignSelf: "stretch",
            boxSizing: "border-box",
            px: 3,
            py: 2,
            borderRadius: 1,
            ...elevationSx,
          }}
        >
          <Stack spacing={2} sx={{ width: "100%" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: "100%" }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Typography variant="h6" sx={{ color: "primary.dark" }}>
                  Shipment Details
                </Typography>
                <Tooltip title={shipmentDetailsEditUnlocked ? "Lock Details" : "Unlock Details"}>
                  <IconButton
                    size="small"
                    aria-label={shipmentDetailsEditUnlocked ? "Lock shipment details" : "Unlock shipment details"}
                    aria-pressed={shipmentDetailsEditUnlocked}
                    onClick={() => {
                      setShipmentDetailsEditUnlocked((open) => {
                        if (open) {
                          if (trackingManualMode && !manualTrackingLoadedFromApiRef.current) {
                            setTrackingManualMode(false);
                            setManualTrackingInput("");
                          }
                        }
                        return !open;
                      });
                    }}
                  >
                    {shipmentDetailsEditUnlocked ? (
                      <LockOpenOutlinedIcon fontSize="small" />
                    ) : (
                      <LockOutlinedIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              </Stack>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  bgcolor: pink[50],
                  px: 1.25,
                  py: 0.5,
                  borderRadius: "4px",
                  typography: "body1",
                  letterSpacing: "0.15px",
                }}
              >
                <Box component="span" sx={{ color: pink[900], fontWeight: 700 }}>
                  Event:
                </Box>
                <Box component="span" sx={{ color: pink[900], fontWeight: 400 }}>
                  51-20E
                </Box>
              </Box>
            </Stack>

            <Box
              sx={{
                display: "grid",
                width: "100%",
                minWidth: 0,
                columnGap: 2,
                rowGap: 0,
                alignItems: "start",
                justifyContent: "space-between",
                overflowX: "auto",
                pb: 0.5,
                gridTemplateColumns:
                  "minmax(118px, max-content) 145px minmax(100px, max-content) minmax(188px, max-content) 1px minmax(92px, max-content) minmax(99px, max-content) minmax(100px, max-content) minmax(52px, max-content)",
              }}
            >
              <Box sx={{ minWidth: 0, width: "100%" }}>
                <FieldBlock label="Shipment ID">
                  <Stack
                    spacing={shipmentDetailsEditUnlocked ? 0.5 : 0}
                    sx={{ width: "100%", minWidth: 0 }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0, width: "100%" }}>
                      <DetailValue>{displayedShipmentId}</DetailValue>
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {shipmentDetailsEditUnlocked ? (
                          <Tooltip title="Merukazim">
                            <NorthEastIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                          </Tooltip>
                        ) : null}
                      </Box>
                    </Stack>
                    <ShipmentFieldActionArea visible={shipmentDetailsEditUnlocked}>
                      <ShipmentFieldActionLink onClick={() => setShipmentHistoryDialogOpen(true)}>
                        View History
                      </ShipmentFieldActionLink>
                    </ShipmentFieldActionArea>
                  </Stack>
                </FieldBlock>
              </Box>
              <Box sx={{ minWidth: 0, width: "100%" }}>
                <FieldBlock label="Tracking ID">
                  {trackingManualMode ? (
                    <Stack
                      spacing={shipmentDetailsEditUnlocked ? 0.5 : 0}
                      sx={{ alignItems: "flex-start", minWidth: 0, width: "100%", maxWidth: 145 }}
                    >
                      {trackingManualSaved ? (
                        /* Saved state: value + pencil edit on right */
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                          sx={{
                            borderBottom: "1px solid transparent",
                            pb: 0.25,
                            minHeight: 36,
                            width: "100%",
                            minWidth: 0,
                          }}
                        >
                          <Box
                            sx={{
                              typography: "body1",
                              letterSpacing: "0.15px",
                              minWidth: 0,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              flex: "1 1 0",
                            }}
                          >
                            {manualTrackingInput}
                          </Box>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              aria-label="Edit tracking ID"
                              onClick={() => setTrackingManualSaved(false)}
                              sx={{ color: "action.active", flexShrink: 0 }}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      ) : (
                        /* Editing state: input + checkmark when non-empty */
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.5}
                          sx={{
                            borderBottom: "1px solid",
                            borderColor: "divider",
                            pb: 0.25,
                            minHeight: 36,
                            width: "100%",
                            minWidth: 0,
                          }}
                        >
                          <InputBase
                            placeholder="Enter Number"
                            value={manualTrackingInput}
                            onChange={(e) => setManualTrackingInput(e.target.value)}
                            inputProps={{ "aria-label": "Manual tracking ID" }}
                            sx={{
                              typography: "body1",
                              letterSpacing: "0.15px",
                              flex: "1 1 0",
                              minWidth: 0,
                              width: "100%",
                              "& input": { width: "100%", minWidth: 0, textOverflow: "ellipsis" },
                              "& input::placeholder": { opacity: 1, color: "action.disabled" },
                            }}
                          />
                          {manualTrackingInput.trim() !== "" && (
                            <Tooltip title="Save">
                              <IconButton
                                size="small"
                                aria-label="Save tracking ID"
                                onClick={() => {
                                  manualTrackingLoadedFromApiRef.current = true;
                                  setTrackingManualSaved(true);
                                }}
                                sx={{ color: "action.active", flexShrink: 0 }}
                              >
                                <CheckIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      )}
                      <ShipmentFieldActionArea visible={shipmentDetailsEditUnlocked}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Link
                            component="button"
                            type="button"
                            underline="hover"
                            onClick={() => {
                              manualTrackingLoadedFromApiRef.current = false;
                              setTrackingManualMode(false);
                              setTrackingManualSaved(false);
                              setManualTrackingInput("");
                            }}
                            sx={{
                              typography: "body1",
                              fontWeight: 400,
                              letterSpacing: "0.15px",
                              cursor: "pointer",
                              alignSelf: "flex-start",
                              border: "none",
                              background: "none",
                              padding: 0,
                              font: "inherit",
                              color: "primary.dark",
                              textAlign: "left",
                            }}
                          >
                            Remove Manual ID
                          </Link>
                        </Stack>
                      </ShipmentFieldActionArea>
                    </Stack>
                  ) : (
                    <Stack
                      spacing={shipmentDetailsEditUnlocked ? 0.5 : 0}
                      sx={{ alignItems: "flex-start", minWidth: 0, width: "100%" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          height: 36,
                          width: "100%",
                          boxSizing: "border-box",
                          borderBottom: "1px solid transparent",
                          pb: 0.25,
                        }}
                      >
                        <DetailValue>None</DetailValue>
                      </Box>
                      <ShipmentFieldActionArea visible={shipmentDetailsEditUnlocked}>
                        <ShipmentFieldActionLink
                          onClick={() => {
                            manualTrackingLoadedFromApiRef.current = false;
                            setTrackingManualMode(true);
                          }}
                          disabledReason={orderShipped ? "This shipment has already been shipped" : undefined}
                        >
                          Add Manual ID
                        </ShipmentFieldActionLink>
                      </ShipmentFieldActionArea>
                    </Stack>
                  )}
                </FieldBlock>
              </Box>
              <Box sx={{ minWidth: 0, width: "100%" }}>
                <FieldBlock label="Carrier Route">
                  <Stack
                    spacing={shipmentDetailsEditUnlocked ? 0.5 : 0}
                    sx={{ width: "100%", minWidth: 0 }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={0}
                      sx={{ gap: "8px", ...carrierRouteServiceBadgeBoxSx }}
                    >
                      {activeCarrierLogoSrc ? (
                        <>
                          <Box
                            component="img"
                            src={activeCarrierLogoSrc}
                            alt={formatCarrierRouteDisplay(activeRoute)}
                            sx={{
                              height: 16,
                              width: "auto",
                              maxWidth: 88,
                              objectFit: "contain",
                              display: "block",
                              flexShrink: 0,
                            }}
                          />
                          <Typography variant="body1" color="text.primary" letterSpacing="0.15px" sx={{ minWidth: 0 }}>
                            {formatCarrierRouteDisplay(activeRoute)}
                          </Typography>
                        </>
                      ) : (
                        <DetailValue>{formatCarrierRouteDisplay(activeRoute)}</DetailValue>
                      )}
                    </Stack>
                    <ShipmentFieldActionArea visible={shipmentDetailsEditUnlocked}>
                      <ShipmentFieldActionLink
                        onClick={() => setCarrierRouteDialogOpen(true)}
                        disabledReason={orderShipped ? "This shipment has already been shipped" : undefined}
                      >
                        Edit Shipping Route
                      </ShipmentFieldActionLink>
                    </ShipmentFieldActionArea>
                  </Stack>
                </FieldBlock>
              </Box>
              <Box sx={{ minWidth: 0, width: "100%" }}>
                <FieldBlock label="Destination">
                  <Stack
                    spacing={shipmentDetailsEditUnlocked ? 0.5 : 0}
                    sx={{ width: "100%", minWidth: 0 }}
                  >
                    <Typography
                      variant="body1"
                      color="text.primary"
                      letterSpacing="0.15px"
                      sx={{ wordBreak: "break-word" }}
                    >
                      {destinationDisplay}
                    </Typography>
                    {/* Phase 1: hidden — restore by replacing false with shipmentDetailsEditUnlocked */}
                    <ShipmentFieldActionArea visible={false}>
                      <ShipmentFieldActionLink
                        onClick={() => setAddressDialogOpen(true)}
                        disabledReason={orderShipped ? "This shipment has already been shipped" : undefined}
                      >
                        Update Address
                      </ShipmentFieldActionLink>
                    </ShipmentFieldActionArea>
                  </Stack>
                </FieldBlock>
              </Box>
              <Box
                sx={{
                  width: 1,
                  minWidth: 1,
                  alignSelf: "stretch",
                  justifySelf: "center",
                  mx: 0,
                  minHeight: 0,
                  bgcolor: "divider",
                }}
                aria-hidden
              />
              <Box sx={{ minWidth: 0, width: "100%" }}>
                <FieldBlock label="Order Number">
                  <Stack
                    spacing={shipmentDetailsEditUnlocked ? 0.5 : 0}
                    sx={{ width: "100%", minWidth: 0 }}
                  >
                    <DetailValue>{displayedOrderNumberForDetails ?? ""}</DetailValue>
                    {/* Phase 1: hidden — restore by replacing false with shipmentDetailsEditUnlocked */}
                    <ShipmentFieldActionArea visible={false}>
                      <ShipmentFieldActionLink onClick={() => setOrderHistoryDialogOpen(true)}>
                        View History
                      </ShipmentFieldActionLink>
                    </ShipmentFieldActionArea>
                  </Stack>
                </FieldBlock>
              </Box>
              <Box sx={{ minWidth: 0, width: "100%" }}>
                <FieldBlock label="Order Date">
                  <DetailValue>12/12/2024</DetailValue>
                </FieldBlock>
              </Box>
              <Box sx={{ minWidth: 0, width: "100%" }}>
                <FieldBlock label="Due Date">
                  <DetailValue>12/23/2024</DetailValue>
                </FieldBlock>
              </Box>
              <Box sx={{ minWidth: 0, width: "100%" }}>
                <FieldBlock label="Site ID">
                  <DetailValue>27</DetailValue>
                </FieldBlock>
              </Box>
            </Box>
          </Stack>
        </Paper>

        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={3}
          alignItems="stretch"
          justifyContent="center"
          sx={{ width: "100%", maxWidth: 1600 }}
        >
          <Stack spacing={3} sx={{ flex: "1 1 0%", minWidth: 0, width: "100%" }}>
          <Paper
            elevation={1}
            sx={{
              minWidth: 0,
              width: "100%",
              px: 3,
              py: 2,
              boxSizing: "border-box",
              borderRadius: 1,
              ...elevationSx,
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              useFlexGap
              spacing={2}
              sx={{ mb: 0, width: "100%", minWidth: 0 }}
            >
              <Typography variant="h6" sx={{ color: "primary.dark", flexShrink: 0 }}>
                Items to Pack ({packItemCountUi})
              </Typography>
              {isSimilarOrdersView || isSplitOrdersView ? (
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1.5}
                  sx={{
                    flexShrink: 0,
                    minWidth: 0,
                    maxWidth: "100%",
                    justifyContent: { xs: "flex-end", sm: "flex-start" },
                    flex: { xs: "1 1 100%", sm: "0 0 auto" },
                  }}
                >
                  <Typography
                    component="span"
                    variant="body1"
                    sx={{
                      color: "text.primary",
                      fontWeight: 600,
                      fontSize: 15,
                      letterSpacing: "0.15px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Shipment:
                  </Typography>
                  {isSimilarOrdersView ? (
                    <LinkedShipmentTabs
                      tabs={similarOrderTabsResolved.map((t) => ({
                        key: t.key,
                        shipmentId: t.shipmentId,
                        factoryLabel: t.factoryLabel,
                      }))}
                      value={similarShipmentTabIndex}
                      onChange={setSimilarOrdersTabIndex}
                      ariaLabel="Similar shipments"
                      idPrefix="similar-order-tab"
                    />
                  ) : (
                    <LinkedShipmentTabs
                      tabs={splitOrderTabsResolved.map((t) => ({
                        key: t.key,
                        shipmentId: t.shipmentId,
                        factoryLabel: t.factoryLabel,
                      }))}
                      value={splitShipmentTabIndex}
                      onChange={setSplitOrdersTabIndex}
                      ariaLabel="Split shipments"
                      idPrefix="split-order-tab"
                    />
                  )}
                </Stack>
              ) : null}
            </Stack>
            <Divider sx={{ my: 3 }} />

            {showPackLine0Ui ? (
              <ItemBlock
                showHoldAssignDefault={showItemContainerAssignRow}
                robotCellAssignUi={robotCellAssignUi}
                storageAssignByItemId={storageAssignByItemId}
                assignStoragePopupItemId={assignStoragePopupItemId}
                onOpenAssignStorage={handleOpenAssignStorage}
                onReleaseStorage={handleReleaseStorage}
                title={PACK_LINE_ITEM_META[0].title}
                image={IMG.item1}
                imageRadius={1}
                itemId={PACK_LINE_ITEM_META[0].id}
                itemRemarkCount={remarkCountByItemId[PACK_LINE_ITEM_META[0].id] ?? 0}
                onItemRemarksClick={() => openItemRemarksDialog(PACK_LINE_ITEM_META[0].id)}
                titleRowEnd={
                  remoteFacilityItemReceivedControl(PACK_LINE_ITEM_META[0].id) ??
                  inProductionItemSentControl(PACK_LINE_ITEM_META[0].id) ??
                  undefined
                }
                details={
                  <>
                    <SectionOverline>Details</SectionOverline>
                    <DetailRow label="Inscription #1:" value="Jane" />
                    <DetailRow label="Inscription #2:" value="Kelsey" />
                    <DetailRow label="Inscription #3:" value="Tiffany" />
                    <DetailRow label="Material:" value="18K Rose Gold Vermeil" />
                    <DetailRow label="Diamond:" value="Without Diamond" />
                    <DetailRow label="Size:" value={'18" - 22"'} />
                  </>
                }
                packaging={
                  hideInlineItemPackingInstructions ? null : (
                    <ItemPackingInstructionsCard
                      {...(showItemLevelMultiInstructionsDemo
                        ? { prototypeVariants: [PROTOTYPE_ITEM_INSTRUCTIONS, PROTOTYPE_ITEM_INSTRUCTIONS_SINGLE] }
                        : { instructions: [{ text: PROTOTYPE_PACKING_INSTRUCTIONS_MEDIUM, image: IMG.boxMedium }] })}
                    />
                  )
                }
              />
            ) : null}

            {showPackLine1Ui ? (
              <Fragment>
                {showPackLine0Ui ? <Divider sx={{ my: 3 }} /> : null}
                <ItemBlock
                  showHoldAssignDefault={showItemContainerAssignRow}
                  robotCellAssignUi={robotCellAssignUi}
                  storageAssignByItemId={storageAssignByItemId}
                  assignStoragePopupItemId={assignStoragePopupItemId}
                  onOpenAssignStorage={handleOpenAssignStorage}
                  onReleaseStorage={handleReleaseStorage}
                  title={PACK_LINE_ITEM_META[1].title}
                  image={IMG.item2}
                  imageOverlay
                  itemId={PACK_LINE_ITEM_META[1].id}
                  itemRemarkCount={remarkCountByItemId[PACK_LINE_ITEM_META[1].id] ?? 0}
                  onItemRemarksClick={() => openItemRemarksDialog(PACK_LINE_ITEM_META[1].id)}
                  titleRowEnd={inProductionItemSentControl(PACK_LINE_ITEM_META[1].id) ?? undefined}
                  details={
                    <>
                      <SectionOverline>Details</SectionOverline>
                      <DetailRow label="Material:" value="18K Gold Vermeil" />
                      <DetailRow label="Diamond:" value="With Diamond" />
                      <DetailRow label="Inscription #1:" value="Stacy" />
                      <DetailRow label="Inscription #2:" value="John" />
                      <DetailRow label="Carat Weight:" value=".25 ct" />
                      <DetailRow label="Chain Length:" value={'18" - 22"'} />
                    </>
                  }
                  packaging={
                    hideInlineItemPackingInstructions ? null : (
                      <ItemPackingInstructionsCard
                        instructions={[{ text: PROTOTYPE_PACKING_INSTRUCTIONS_SMALL, image: IMG.boxSmall }]}
                      />
                    )
                  }
                />
              </Fragment>
            ) : null}

            {showPackLine2Ui ? (
              <Fragment>
                {(showPackLine0Ui || showPackLine1Ui) ? <Divider sx={{ my: 3 }} /> : null}
                <ItemBlock
                  showHoldAssignDefault={showItemContainerAssignRow}
                  robotCellAssignUi={robotCellAssignUi}
                  storageAssignByItemId={storageAssignByItemId}
                  assignStoragePopupItemId={assignStoragePopupItemId}
                  onOpenAssignStorage={handleOpenAssignStorage}
                  onReleaseStorage={handleReleaseStorage}
                  title={PACK_LINE_ITEM_META[2].title}
                  image={IMG.item3}
                  imageOverlay
                  itemId={PACK_LINE_ITEM_META[2].id}
                  itemRemarkCount={remarkCountByItemId[PACK_LINE_ITEM_META[2].id] ?? 0}
                  onItemRemarksClick={() => openItemRemarksDialog(PACK_LINE_ITEM_META[2].id)}
                  titleRowEnd={inProductionItemSentControl(PACK_LINE_ITEM_META[2].id) ?? undefined}
                  details={
                    <>
                      <SectionOverline>Details</SectionOverline>
                      <DetailRow label="Name:" value="Stephanie" />
                      <Stack direction="row" spacing={3} alignItems="flex-start" sx={{ width: "100%" }}>
                        <Typography variant="body1" color="text.secondary" sx={{ width: 120, flexShrink: 0 }}>
                          Gift Note:
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={500}
                          color="text.primary"
                          sx={{ flex: "1 1 0", minWidth: 0, wordBreak: "break-word" }}
                        >
                          To my beloved wife, every piece of jewelry tells a story, and this one is a reminder of our
                          beautiful journey together. I love you more than words can express. Forever yours.
                        </Typography>
                      </Stack>
                    </>
                  }
                  packaging={null}
                />
              </Fragment>
            ) : null}

            {extraPackItemsUi.map((item, extraIdx) => (
              <Box key={item.id}>
                {(anyPrimaryPackLineVisibleUi || extraIdx > 0) ? <Divider sx={{ my: 3 }} /> : null}
                <ItemBlock
                  showHoldAssignDefault={showItemContainerAssignRow}
                  robotCellAssignUi={robotCellAssignUi}
                  storageAssignByItemId={storageAssignByItemId}
                  assignStoragePopupItemId={assignStoragePopupItemId}
                  onOpenAssignStorage={handleOpenAssignStorage}
                  onReleaseStorage={handleReleaseStorage}
                  title={item.title}
                  image={item.image}
                  itemId={item.id}
                  itemRemarkCount={remarkCountByItemId[item.id] ?? 0}
                  onItemRemarksClick={() => openItemRemarksDialog(item.id)}
                  titleRowEnd={inProductionItemSentControl(item.id) ?? undefined}
                  details={
                    <>
                      <SectionOverline>Details</SectionOverline>
                      {item.id === "split-proto-product-4" ||
                      item.id === "similar-order-product-4" ||
                      item.id === "join-ext-sh74513-1" ||
                      item.id === "join-ext-1" ? (
                        <>
                          <DetailRow label="Material:" value="18K Gold Vermeil" />
                          <DetailRow label="Initial:" value="L" />
                          <DetailRow label="Birthstone:" value="Clear Crystal" />
                          <DetailRow label="Chain Length:" value={'18" - 22"'} />
                        </>
                      ) : (
                        <DetailRow label="Source:" value="Joined shipment" />
                      )}
                    </>
                  }
                  packaging={null}
                />
              </Box>
            ))}

            {visibleRemoteReceivedIdsOrderedUi.map((rid, remoteIdx) => {
              const showRemoteLeadDivider =
                anyPrimaryPackLineVisibleUi || extraPackItemsUi.length > 0 || remoteIdx > 0;
              if (rid === PACK_LINE_ITEM_META[0].id) {
                // Received from another facility → now in "Items to Pack": keep the checked
                // "Item Received" checkbox (so the worker can uncheck to send it back) and show
                // the unassigned "Assign storage" button to its right. Popup is not auto-opened.
                const remoteReceivedItemCheckbox = remoteFacilityItemReceivedControl(rid);
                return (
                  <Box key={`remote-received-${rid}`}>
                    {showRemoteLeadDivider ? <Divider sx={{ my: 3 }} /> : null}
                    <ItemBlock
                      showHoldAssignDefault={showItemContainerAssignRow}
                      assignRowLeading={remoteReceivedItemCheckbox ?? undefined}
                      robotCellAssignUi={robotCellAssignUi}
                      storageAssignByItemId={storageAssignByItemId}
                      assignStoragePopupItemId={assignStoragePopupItemId}
                      onOpenAssignStorage={handleOpenAssignStorage}
                      onReleaseStorage={handleReleaseStorage}
                      title={PACK_LINE_ITEM_META[0].title}
                      image={IMG.item1}
                      imageRadius={1}
                      itemId={PACK_LINE_ITEM_META[0].id}
                      itemRemarkCount={remarkCountByItemId[PACK_LINE_ITEM_META[0].id] ?? 0}
                      onItemRemarksClick={() => openItemRemarksDialog(PACK_LINE_ITEM_META[0].id)}
                      details={
                        <>
                          <SectionOverline>Details</SectionOverline>
                          <DetailRow label="Inscription #1:" value="Jane" />
                          <DetailRow label="Inscription #2:" value="Kelsey" />
                          <DetailRow label="Inscription #3:" value="Tiffany" />
                          <DetailRow label="Material:" value="18K Rose Gold Vermeil" />
                          <DetailRow label="Diamond:" value="Without Diamond" />
                          <DetailRow label="Size:" value={'18" - 22"'} />
                        </>
                      }
                      packaging={
                        hideInlineItemPackingInstructions ? null : (
                          <ItemPackingInstructionsCard
                            {...(showItemLevelMultiInstructionsDemo
                        ? { prototypeVariants: [PROTOTYPE_ITEM_INSTRUCTIONS, PROTOTYPE_ITEM_INSTRUCTIONS_SINGLE] }
                        : { instructions: [{ text: PROTOTYPE_PACKING_INSTRUCTIONS_MEDIUM, image: IMG.boxMedium }] })}
                          />
                        )
                      }
                    />
                  </Box>
                );
              }
              if (rid === PACK_LINE_ITEM_META[1].id) {
                return (
                  <Box key={`remote-received-${rid}`}>
                    {showRemoteLeadDivider ? <Divider sx={{ my: 3 }} /> : null}
                    <ItemBlock
                      showHoldAssignDefault={showItemContainerAssignRow}
                      robotCellAssignUi={robotCellAssignUi}
                      storageAssignByItemId={storageAssignByItemId}
                      assignStoragePopupItemId={assignStoragePopupItemId}
                      onOpenAssignStorage={handleOpenAssignStorage}
                      onReleaseStorage={handleReleaseStorage}
                      title={PACK_LINE_ITEM_META[1].title}
                      image={IMG.item2}
                      imageOverlay
                      itemId={PACK_LINE_ITEM_META[1].id}
                      itemRemarkCount={remarkCountByItemId[PACK_LINE_ITEM_META[1].id] ?? 0}
                      onItemRemarksClick={() => openItemRemarksDialog(PACK_LINE_ITEM_META[1].id)}
                      details={
                        <>
                          <SectionOverline>Details</SectionOverline>
                          <DetailRow label="Material:" value="18K Gold Vermeil" />
                          <DetailRow label="Diamond:" value="With Diamond" />
                          <DetailRow label="Inscription #1:" value="Stacy" />
                          <DetailRow label="Inscription #2:" value="John" />
                          <DetailRow label="Carat Weight:" value=".25 ct" />
                          <DetailRow label="Chain Length:" value={'18" - 22"'} />
                        </>
                      }
                      packaging={
                        hideInlineItemPackingInstructions ? null : (
                          <ItemPackingInstructionsCard
                            instructions={[{ text: PROTOTYPE_PACKING_INSTRUCTIONS_SMALL, image: IMG.boxSmall }]}
                          />
                        )
                      }
                    />
                  </Box>
                );
              }
              if (rid === PACK_LINE_ITEM_META[2].id) {
                return (
                  <Box key={`remote-received-${rid}`}>
                    {showRemoteLeadDivider ? <Divider sx={{ my: 3 }} /> : null}
                    <ItemBlock
                      showHoldAssignDefault={showItemContainerAssignRow}
                      robotCellAssignUi={robotCellAssignUi}
                      storageAssignByItemId={storageAssignByItemId}
                      assignStoragePopupItemId={assignStoragePopupItemId}
                      onOpenAssignStorage={handleOpenAssignStorage}
                      onReleaseStorage={handleReleaseStorage}
                      title={PACK_LINE_ITEM_META[2].title}
                      image={IMG.item3}
                      imageOverlay
                      itemId={PACK_LINE_ITEM_META[2].id}
                      itemRemarkCount={remarkCountByItemId[PACK_LINE_ITEM_META[2].id] ?? 0}
                      onItemRemarksClick={() => openItemRemarksDialog(PACK_LINE_ITEM_META[2].id)}
                      details={
                        <>
                          <SectionOverline>Details</SectionOverline>
                          <DetailRow label="Name:" value="Stephanie" />
                          <Stack direction="row" spacing={3} alignItems="flex-start" sx={{ width: "100%" }}>
                            <Typography variant="body1" color="text.secondary" sx={{ width: 120, flexShrink: 0 }}>
                              Gift Note:
                            </Typography>
                            <Typography
                              variant="body1"
                              fontWeight={500}
                              color="text.primary"
                              sx={{ flex: "1 1 0", minWidth: 0, wordBreak: "break-word" }}
                            >
                              To my beloved wife, every piece of jewelry tells a story, and this one is a reminder of
                              our beautiful journey together. I love you more than words can express. Forever yours.
                            </Typography>
                          </Stack>
                        </>
                      }
                      packaging={null}
                    />
                  </Box>
                );
              }
              return null;
            })}

            {!hidePackActionsUi && (
              <>
                <Divider sx={{ mx: -3, mt: 3 }} />
                <Box
                  sx={{
                    position: "relative",
                    pt: packButtonLayout === "v3" ? 1 : 3,
                    pb: packButtonLayout === "v3" ? 1 : 3,
                    /* V1: equal 48px both sides. V2: 48px left, 0 right (Paper's p:3 provides the gap). V3: minimal */
                    pl: packButtonLayout === "v3" ? 1 : 6,
                    pr: packButtonLayout === "v1" ? 6 : packButtonLayout === "v2" ? 0 : 1,
                  }}
                >

                  {packButtonLayout === "v2" ? (
                    /* V2: horizontal row, right-aligned. Secondary buttons + divider + Pack */
                    <Stack direction="row" alignItems="center" justifyContent="flex-end">
                      {/* Secondary buttons */}
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        {!orderPacked && !hungaryFactoryDemoActive ? (
                          <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<HandymanOutlinedIcon />}
                            onClick={() => setSendToFixDialogOpen(true)}
                            sx={{
                              height: 52,
                              px: 6,
                              fontSize: 17,
                              fontWeight: 500,
                              borderColor: "primary.main",
                              color: "primary.main",
                              whiteSpace: "nowrap",
                              borderRadius: 100,
                            }}
                          >
                            Send to Fix
                          </Button>
                        ) : null}
                        <Button
                          variant="outlined"
                          color="primary"
                          id="more-actions-button"
                          aria-controls={moreActionsMenuAnchor ? "more-actions-menu" : undefined}
                          aria-expanded={moreActionsMenuAnchor ? "true" : "false"}
                          aria-haspopup="true"
                          endIcon={<ExpandMoreIcon />}
                          onClick={(e) => setMoreActionsMenuAnchor(e.currentTarget)}
                          sx={{
                            height: 52,
                            px: 6,
                            fontSize: 17,
                            fontWeight: 500,
                            borderColor: "primary.main",
                            color: "primary.main",
                            whiteSpace: "nowrap",
                            borderRadius: 100,
                          }}
                        >
                          More Actions
                        </Button>
                      </Stack>
                      {/* Divider with 24px gap on each side */}
                      <Divider orientation="vertical" flexItem sx={{ mx: 3, my: 0.5 }} />
                      {/* Pack button */}
                      <Button
                        key={packSuccessAnimNonce}
                        variant="contained"
                        color="primary"
                        disabled={
                          (packingOrderUiStatus !== "readyToPack" && packingOrderUiStatus !== "packApiFailed") ||
                          (trackingManualMode && !trackingManualSaved) ||
                          fallbackPackSubmitPhase === "loading"
                        }
                        onClick={() => {
                          if (fallbackPackSubmitPhase === "loading") return;
                          if (
                            (packingOrderUiStatus !== "readyToPack" && packingOrderUiStatus !== "packApiFailed") ||
                            (trackingManualMode && !trackingManualSaved)
                          ) return;
                          if (isFallbackPrototype) { startFallbackPackApiSimulation(); return; }
                          if (packingOrderUiStatus === "readyToPack" && (!trackingManualMode || trackingManualSaved)) {
                            setPackingOrderUiStatus("packed");
                            setPackSuccessAnimNonce((n) => n + 1);
                          }
                        }}
                        startIcon={
                          fallbackPackSubmitPhase === "loading" ? (
                            <CircularProgress size={20} color="inherit" sx={{ color: "#fff !important" }} />
                          ) : (
                            <ShoppingBagOutlinedIcon />
                          )
                        }
                        sx={{
                          height: 52,
                          px: 6,
                          fontSize: 17,
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                          borderRadius: 100,
                          transformOrigin: "center center",
                          ...(packSuccessAnimNonce > 0 && {
                            animation: `${packSuccessPop} 0.62s cubic-bezier(0.34, 1.45, 0.64, 1)`,
                          }),
                          ...(trackingManualMode &&
                            packingOrderUiStatus === "readyToPack" &&
                            trackingManualSaved && {
                              "&:not(.Mui-disabled)": {
                                bgcolor: "#ed6c02",
                                color: "#fff",
                                "&:hover": { bgcolor: "#e65100" },
                              },
                            }),
                        }}
                      >
                        {fallbackPackSubmitPhase === "loading"
                          ? "Packing…"
                          : trackingManualMode
                            ? `Manual Pack ${packItemCountUi} Items`
                            : `Pack ${packItemCountUi} Items`}
                      </Button>
                      <Menu
                        id="more-actions-menu"
                        anchorEl={moreActionsMenuAnchor}
                        open={Boolean(moreActionsMenuAnchor)}
                        onClose={() => setMoreActionsMenuAnchor(null)}
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
                        slotProps={{
                          paper: {
                            elevation: 8,
                            sx: { minWidth: 276, mb: 0.5, borderRadius: 1, py: 1, boxSizing: "border-box" },
                          },
                        }}
                      >
                        {moreActionsMenuItems.map(({ id, label, Icon }) => (
                          <MenuItem
                            key={id}
                            disabled={id === "reprint-packing-label"}
                            onClick={() => {
                              setMoreActionsMenuAnchor(null);
                              if (id === "unpack-shipment") setPackingOrderUiStatus("readyToPack");
                              if (id === "join-shipment") setJoinShipmentDialogOpen(true);
                              if (id === "split-shipment") setSplitShipmentDialogOpen(true);
                            }}
                            sx={{ py: 0.75, px: 2, typography: "body1" }}
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <Icon sx={{ fontSize: 20, color: "action.active" }} />
                            </ListItemIcon>
                            {label}
                          </MenuItem>
                        ))}
                      </Menu>
                    </Stack>
                  ) : packButtonLayout === "v1" ? (
                    /* V1: stacked layout, equal 48px padding both sides */
                    <Stack spacing={1.5}>
                      <Button
                        key={packSuccessAnimNonce}
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={
                          (packingOrderUiStatus !== "readyToPack" && packingOrderUiStatus !== "packApiFailed") ||
                          (trackingManualMode && !trackingManualSaved) ||
                          fallbackPackSubmitPhase === "loading"
                        }
                        onClick={() => {
                          if (fallbackPackSubmitPhase === "loading") return;
                          if (
                            (packingOrderUiStatus !== "readyToPack" && packingOrderUiStatus !== "packApiFailed") ||
                            (trackingManualMode && !trackingManualSaved)
                          ) {
                            return;
                          }
                          if (isFallbackPrototype) {
                            startFallbackPackApiSimulation();
                            return;
                          }
                          if (
                            packingOrderUiStatus === "readyToPack" &&
                            (!trackingManualMode || trackingManualSaved)
                          ) {
                            setPackingOrderUiStatus("packed");
                            setPackSuccessAnimNonce((n) => n + 1);
                          }
                        }}
                        startIcon={
                          fallbackPackSubmitPhase === "loading" ? (
                            <CircularProgress size={22} color="inherit" sx={{ color: "#fff !important" }} />
                          ) : isFallbackPrototype && fallbackPackSubmitPhase === "failed" ? (
                            <SyncIcon sx={{ color: "#fff !important" }} />
                          ) : (
                            <ShoppingBagOutlinedIcon
                              sx={
                                trackingManualMode &&
                                packingOrderUiStatus === "readyToPack" &&
                                trackingManualSaved
                                  ? { color: "#fff !important" }
                                  : undefined
                              }
                            />
                          )
                        }
                        sx={{
                          minHeight: 56,
                          height: 56,
                          py: 0,
                          boxSizing: "border-box",
                          fontSize: 18,
                          fontWeight: 500,
                          borderRadius: 100,
                          transformOrigin: "center center",
                          ...(packSuccessAnimNonce > 0 && {
                            animation: `${packSuccessPop} 0.62s cubic-bezier(0.34, 1.45, 0.64, 1)`,
                          }),
                          ...(trackingManualMode &&
                            packingOrderUiStatus === "readyToPack" &&
                            trackingManualSaved && {
                              "&:not(.Mui-disabled)": {
                                bgcolor: "#ed6c02",
                                color: "#fff",
                                "&:hover": { bgcolor: "#e65100" },
                              },
                            }),
                        }}
                      >
                        {fallbackPackSubmitPhase === "loading"
                          ? "Packing…"
                          : isFallbackPrototype && fallbackPackSubmitPhase === "failed"
                            ? `Retry Pack ${packItemCountUi} Items`
                            : trackingManualMode
                              ? `Manual Pack ${packItemCountUi} Items`
                              : `Pack ${packItemCountUi} Items`}
                      </Button>
                      {(!hungaryFactoryDemoActive || orderPacked) ? (
                        <Stack spacing={0}>
                          {showFallbackPackButton ? (
                            <Button
                              fullWidth
                              variant="outlined"
                              color="primary"
                              onClick={() => setFallbackPackDialogOpen(true)}
                              sx={{
                                minHeight: 56,
                                height: 56,
                                py: 0,
                                boxSizing: "border-box",
                                fontSize: 18,
                                fontWeight: 500,
                                textTransform: "none",
                                borderColor: "primary.main",
                                color: "primary.main",
                                borderRadius: 100,
                              }}
                            >
                              Fallback Pack
                            </Button>
                          ) : null}
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={
                              showFallbackPackButton
                                ? { mt: 3, borderTop: "1px solid", borderColor: "divider", pt: 3 }
                                : undefined
                            }
                          >
                            {!orderPacked && !hungaryFactoryDemoActive ? (
                              <Button
                                fullWidth
                                variant="outlined"
                                color="primary"
                                startIcon={<HandymanOutlinedIcon />}
                                onClick={() => setSendToFixDialogOpen(true)}
                                sx={{
                                  minHeight: 56,
                                  height: 56,
                                  py: 0,
                                  boxSizing: "border-box",
                                  fontSize: 18,
                                  fontWeight: 500,
                                  borderColor: "primary.main",
                                  color: "primary.main",
                                  borderRadius: 100,
                                }}
                              >
                                Send to Fix
                              </Button>
                            ) : null}
                            <Button
                              fullWidth
                              variant="outlined"
                              color="primary"
                              id="more-actions-button"
                              aria-controls={moreActionsMenuAnchor ? "more-actions-menu" : undefined}
                              aria-expanded={moreActionsMenuAnchor ? "true" : "false"}
                              aria-haspopup="true"
                              endIcon={<ExpandMoreIcon />}
                              onClick={(e) => setMoreActionsMenuAnchor(e.currentTarget)}
                              sx={{
                                minHeight: 56,
                                height: 56,
                                py: 0,
                                boxSizing: "border-box",
                                fontSize: 18,
                                fontWeight: 500,
                                borderColor: "primary.main",
                                color: "primary.main",
                                borderRadius: 100,
                              }}
                            >
                              More Actions
                            </Button>
                            <Menu
                              id="more-actions-menu"
                              anchorEl={moreActionsMenuAnchor}
                              open={Boolean(moreActionsMenuAnchor)}
                              onClose={() => setMoreActionsMenuAnchor(null)}
                              anchorOrigin={
                                orderPacked
                                  ? { vertical: "top", horizontal: "right" }
                                  : { vertical: "bottom", horizontal: "right" }
                              }
                              transformOrigin={
                                orderPacked
                                  ? { vertical: "bottom", horizontal: "right" }
                                  : { vertical: "top", horizontal: "right" }
                              }
                              slotProps={{
                                paper: {
                                  elevation: 8,
                                  sx: {
                                    minWidth: 276,
                                    ...(orderPacked ? { mb: 0.5 } : { mt: 0.5 }),
                                    borderRadius: 1,
                                    py: 1,
                                    boxSizing: "border-box",
                                  },
                                },
                              }}
                            >
                              {moreActionsMenuItems.map(({ id, label, Icon }) => (
                                <MenuItem
                                  key={id}
                                  disabled={id === "reprint-packing-label"}
                                  onClick={() => {
                                    setMoreActionsMenuAnchor(null);
                                    if (id === "unpack-shipment") setPackingOrderUiStatus("readyToPack");
                                    if (id === "join-shipment") setJoinShipmentDialogOpen(true);
                                    if (id === "split-shipment") setSplitShipmentDialogOpen(true);
                                  }}
                                  sx={{ py: 0.75, px: 2, typography: "body1" }}
                                >
                                  <ListItemIcon sx={{ minWidth: 36 }}>
                                    <Icon sx={{ fontSize: 20, color: "action.active" }} />
                                  </ListItemIcon>
                                  {label}
                                </MenuItem>
                              ))}
                            </Menu>
                          </Stack>
                        </Stack>
                      ) : null}
                    </Stack>
                  ) : null /* V3: buttons rendered in the fixed bottom bar below */}
                </Box>
              </>
            )}
          </Paper>

          {/* Prototype layout toggle — hidden; V1/V2/V3 code preserved, toggle with useState default */}
          {false && !hidePackActionsUi && (
            <Box
              onClick={() =>
                setPackButtonLayout((v) => (v === "v1" ? "v2" : v === "v2" ? "v3" : "v1"))
              }
              sx={{
                position: "fixed",
                bottom: packButtonLayout === "v3" ? 120 : 16,
                left: 78,
                zIndex: 1201,
                width: 44,
                height: 44,
                borderRadius: "50%",
                bgcolor: "#e91e8c",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                userSelect: "none",
                fontFamily: "inherit",
                letterSpacing: "0.5px",
                "&:hover": { bgcolor: "#e91e8c", opacity: 0.9 },
              }}
            >
              {packButtonLayout.toUpperCase()}
            </Box>
          )}

          {/* V3: floating action bar — transparent centering shell + inner card */}
          {!hidePackActionsUi && packButtonLayout === "v3" && (
            <Box
              sx={{
                position: "fixed",
                bottom: 32,
                left: 70,
                right: 0,
                zIndex: 1200,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                pointerEvents: "none",
              }}
            >
              {/* Floating card that hugs the buttons */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  boxShadow: "0px 8px 32px rgba(0,0,0,0.18)",
                  px: 3,
                  py: 2,
                  pointerEvents: "auto",
                }}
              >
                {/* Secondary buttons group */}
                <Stack direction="row" spacing={1.5} alignItems="center">
                  {!orderPacked && !hungaryFactoryDemoActive ? (
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<HandymanOutlinedIcon />}
                      onClick={() => setSendToFixDialogOpen(true)}
                      sx={{
                        width: 240,
                        height: 48,
                        fontSize: 16,
                        fontWeight: 500,
                        borderRadius: 100,
                        borderColor: "primary.main",
                        color: "primary.main",
                      }}
                    >
                      Send to Fix
                    </Button>
                  ) : null}
                  <Button
                    variant="outlined"
                    color="primary"
                    id="more-actions-button-v3"
                    aria-controls={moreActionsMenuAnchor ? "more-actions-menu-v3" : undefined}
                    aria-expanded={moreActionsMenuAnchor ? "true" : "false"}
                    aria-haspopup="true"
                    endIcon={<ExpandMoreIcon />}
                    onClick={(e) => setMoreActionsMenuAnchor(e.currentTarget)}
                    sx={{
                      width: 280,
                      height: 48,
                      fontSize: 16,
                      fontWeight: 500,
                      px: 0,
                      borderRadius: 100,
                      borderColor: "primary.main",
                      color: "primary.main",
                    }}
                  >
                    More Actions
                  </Button>
                  <Menu
                    id="more-actions-menu-v3"
                    anchorEl={moreActionsMenuAnchor}
                    open={Boolean(moreActionsMenuAnchor)}
                    onClose={() => setMoreActionsMenuAnchor(null)}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    transformOrigin={{ vertical: "bottom", horizontal: "center" }}
                    slotProps={{
                      paper: {
                        elevation: 8,
                        sx: { minWidth: 276, mb: 1, borderRadius: 1, py: 1, boxSizing: "border-box" },
                      },
                    }}
                  >
                    {moreActionsMenuItems.map(({ id, label, Icon }) => (
                      <MenuItem
                        key={id}
                        disabled={id === "reprint-packing-label"}
                        onClick={() => {
                          setMoreActionsMenuAnchor(null);
                          if (id === "unpack-shipment") setPackingOrderUiStatus("readyToPack");
                          if (id === "join-shipment") setJoinShipmentDialogOpen(true);
                          if (id === "split-shipment") setSplitShipmentDialogOpen(true);
                        }}
                        sx={{ py: 0.75, px: 2, typography: "body1" }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <Icon sx={{ fontSize: 20, color: "action.active" }} />
                        </ListItemIcon>
                        {label}
                      </MenuItem>
                    ))}
                  </Menu>
                </Stack>

                {/* Divider with 24px gap on each side */}
                <Divider orientation="vertical" flexItem sx={{ mx: 3, my: 0.5 }} />

                {/* Pack button */}
                <Button
                  key={packSuccessAnimNonce}
                  variant="contained"
                  color="primary"
                  disabled={
                    (packingOrderUiStatus !== "readyToPack" && packingOrderUiStatus !== "packApiFailed") ||
                    (trackingManualMode && !trackingManualSaved) ||
                    fallbackPackSubmitPhase === "loading"
                  }
                  onClick={() => {
                    if (fallbackPackSubmitPhase === "loading") return;
                    if (
                      (packingOrderUiStatus !== "readyToPack" && packingOrderUiStatus !== "packApiFailed") ||
                      (trackingManualMode && !trackingManualSaved)
                    ) return;
                    if (isFallbackPrototype) { startFallbackPackApiSimulation(); return; }
                    if (packingOrderUiStatus === "readyToPack" && (!trackingManualMode || trackingManualSaved)) {
                      setPackingOrderUiStatus("packed");
                      setPackSuccessAnimNonce((n) => n + 1);
                    }
                  }}
                  startIcon={
                    fallbackPackSubmitPhase === "loading" ? (
                      <CircularProgress size={22} color="inherit" sx={{ color: "#fff !important" }} />
                    ) : (
                      <ShoppingBagOutlinedIcon />
                    )
                  }
                  sx={{
                    width: 280,
                    height: 48,
                    fontSize: 16,
                    fontWeight: 700,
                    borderRadius: 100,
                    flexShrink: 0,
                    transformOrigin: "center center",
                    ...(packSuccessAnimNonce > 0 && {
                      animation: `${packSuccessPop} 0.62s cubic-bezier(0.34, 1.45, 0.64, 1)`,
                    }),
                    ...(trackingManualMode &&
                      packingOrderUiStatus === "readyToPack" &&
                      trackingManualSaved && {
                        "&:not(.Mui-disabled)": {
                          bgcolor: "#ed6c02",
                          color: "#fff",
                          "&:hover": { bgcolor: "#e65100" },
                        },
                      }),
                  }}
                >
                  {fallbackPackSubmitPhase === "loading"
                    ? "Packing…"
                    : trackingManualMode
                      ? `Manual Pack ${packItemCountUi} Items`
                      : `Pack ${packItemCountUi} Items`}
                </Button>
              </Box>
            </Box>
          )}

            {showOtherFacilitiesSection ? (
              <Paper
                elevation={1}
                data-node-id="2052:23611;1744:42418"
                sx={{
                  minWidth: 0,
                  width: "100%",
                  px: 3,
                  py: 2,
                  boxSizing: "border-box",
                  borderRadius: 1,
                  ...elevationSx,
                }}
              >
                <Stack
                  spacing={2}
                  sx={{
                    height: "fit-content",
                    "& > .MuiButtonBase-root ~ .MuiCollapse-root": { mt: 0 },
                  }}
                >
                  <ButtonBase
                    focusRipple
                    onClick={() => setOtherFacilitiesSectionExpanded((open) => !open)}
                    aria-expanded={otherFacilitiesSectionExpanded}
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 2,
                      py: 0,
                      px: 0,
                      borderRadius: 1,
                      textAlign: "left",
                    }}
                  >
                    <ExpandMoreIcon
                      sx={{
                        color: "primary.dark",
                        fontSize: 24,
                        transform: otherFacilitiesSectionExpanded ? "rotate(0deg)" : "rotate(-90deg)",
                        transition: (theme) =>
                          theme.transitions.create("transform", { duration: theme.transitions.duration.shorter }),
                      }}
                    />
                    <Typography variant="h6" sx={{ color: "primary.dark", fontWeight: 500 }}>
                      Items in Other Facilities ({remoteFacilityIdsForUi.length})
                    </Typography>
                  </ButtonBase>
                  <Collapse in={otherFacilitiesSectionExpanded}>
                    <Stack spacing={3} sx={{ pt: "32px" }}>
                      {remoteFacilityIdsForUi.map((remoteLineId) => (
                        <Box
                          key={remoteLineId}
                          sx={{
                            position: "relative",
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 1,
                            px: 3,
                            py: 4,
                            boxSizing: "border-box",
                          }}
                        >
                          <OtherFacilityLocationChip
                            label={
                              PROTOTYPE_REMOTE_FACILITY_LOCATION_BY_ITEM_ID[remoteLineId] ?? "Other facility"
                            }
                          />
                          {remoteLineId === PACK_LINE_ITEM_META[0].id ? (
                            <ItemBlock
                              showHoldAssignDefault={false}
                              robotCellAssignUi={robotCellAssignUi}
                              remoteFacilityTitleRow
                              storageAssignByItemId={storageAssignByItemId}
                              assignStoragePopupItemId={assignStoragePopupItemId}
                              onOpenAssignStorage={handleOpenAssignStorage}
                              onReleaseStorage={handleReleaseStorage}
                              title={PACK_LINE_ITEM_META[0].title}
                              image={IMG.item1}
                              imageRadius={1}
                              itemId={PACK_LINE_ITEM_META[0].id}
                              itemRemarkCount={remarkCountByItemId[PACK_LINE_ITEM_META[0].id] ?? 0}
                              onItemRemarksClick={() => openItemRemarksDialog(PACK_LINE_ITEM_META[0].id)}
                              titleRowEnd={
                                remoteFacilityItemReceivedControl(PACK_LINE_ITEM_META[0].id) ?? undefined
                              }
                              details={
                                <>
                                  <SectionOverline>Details</SectionOverline>
                                  <DetailRow label="Inscription #1:" value="Jane" />
                                  <DetailRow label="Inscription #2:" value="Kelsey" />
                                  <DetailRow label="Inscription #3:" value="Tiffany" />
                                  <DetailRow label="Material:" value="18K Rose Gold Vermeil" />
                                  <DetailRow label="Diamond:" value="Without Diamond" />
                                  <DetailRow label="Size:" value={'18" - 22"'} />
                                </>
                              }
                              packaging={
                                hideInlineItemPackingInstructions ? null : (
                                  <ItemPackingInstructionsCard
                                    {...(showItemLevelMultiInstructionsDemo
                        ? { prototypeVariants: [PROTOTYPE_ITEM_INSTRUCTIONS, PROTOTYPE_ITEM_INSTRUCTIONS_SINGLE] }
                        : { instructions: [{ text: PROTOTYPE_PACKING_INSTRUCTIONS_MEDIUM, image: IMG.boxMedium }] })}
                                  />
                                )
                              }
                            />
                          ) : null}
                          {remoteLineId === PACK_LINE_ITEM_META[1].id ? (
                            <ItemBlock
                              showHoldAssignDefault={false}
                              robotCellAssignUi={robotCellAssignUi}
                              storageAssignByItemId={storageAssignByItemId}
                              assignStoragePopupItemId={assignStoragePopupItemId}
                              onOpenAssignStorage={handleOpenAssignStorage}
                              onReleaseStorage={handleReleaseStorage}
                              title={PACK_LINE_ITEM_META[1].title}
                              image={IMG.item2}
                              imageOverlay
                              itemId={PACK_LINE_ITEM_META[1].id}
                              itemRemarkCount={remarkCountByItemId[PACK_LINE_ITEM_META[1].id] ?? 0}
                              onItemRemarksClick={() => openItemRemarksDialog(PACK_LINE_ITEM_META[1].id)}
                              titleRowEnd={
                                remoteFacilityItemReceivedControl(PACK_LINE_ITEM_META[1].id) ?? undefined
                              }
                              details={
                                <>
                                  <SectionOverline>Details</SectionOverline>
                                  <DetailRow label="Material:" value="18K Gold Vermeil" />
                                  <DetailRow label="Diamond:" value="With Diamond" />
                                  <DetailRow label="Inscription #1:" value="Stacy" />
                                  <DetailRow label="Inscription #2:" value="John" />
                                  <DetailRow label="Carat Weight:" value=".25 ct" />
                                  <DetailRow label="Chain Length:" value={'18" - 22"'} />
                                </>
                              }
                              packaging={
                                hideInlineItemPackingInstructions ? null : (
                                  <ItemPackingInstructionsCard
                                    instructions={[{ text: PROTOTYPE_PACKING_INSTRUCTIONS_SMALL, image: IMG.boxSmall }]}
                                  />
                                )
                              }
                            />
                          ) : null}
                          {remoteLineId === PACK_LINE_ITEM_META[2].id ? (
                            <ItemBlock
                              showHoldAssignDefault={false}
                              robotCellAssignUi={robotCellAssignUi}
                              remoteFacilityTitleRow
                              storageAssignByItemId={storageAssignByItemId}
                              assignStoragePopupItemId={assignStoragePopupItemId}
                              onOpenAssignStorage={handleOpenAssignStorage}
                              onReleaseStorage={handleReleaseStorage}
                              title={PACK_LINE_ITEM_META[2].title}
                              image={IMG.item3}
                              imageOverlay
                              itemId={PACK_LINE_ITEM_META[2].id}
                              itemRemarkCount={remarkCountByItemId[PACK_LINE_ITEM_META[2].id] ?? 0}
                              onItemRemarksClick={() => openItemRemarksDialog(PACK_LINE_ITEM_META[2].id)}
                              titleRowEnd={
                                remoteFacilityItemReceivedControl(PACK_LINE_ITEM_META[2].id) ?? undefined
                              }
                              details={
                                <>
                                  <SectionOverline>Details</SectionOverline>
                                  <DetailRow label="Name:" value="Stephanie" />
                                  <Stack direction="row" spacing={3} alignItems="flex-start" sx={{ width: "100%" }}>
                                    <Typography variant="body1" color="text.secondary" sx={{ width: 120, flexShrink: 0 }}>
                                      Gift Note:
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      fontWeight={500}
                                      color="text.primary"
                                      sx={{ flex: "1 1 0", minWidth: 0, wordBreak: "break-word" }}
                                    >
                                      To my beloved wife, every piece of jewelry tells a story, and this one is a
                                      reminder of our beautiful journey together. I love you more than words can express.
                                      Forever yours.
                                    </Typography>
                                  </Stack>
                                </>
                              }
                              packaging={null}
                            />
                          ) : null}
                        </Box>
                      ))}
                    </Stack>
                  </Collapse>
                </Stack>
              </Paper>
            ) : null}

          </Stack>

          <Box
            sx={{
              display: "grid",
              alignContent: "start",
              rowGap: "24px",
              columnGap: "24px",
              width: "100%",
              maxWidth: { xs: "100%", lg: 495 },
              flexShrink: 0,
              minWidth: 0,
              alignSelf: { lg: "flex-start" },
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                md: sidebarSingleColumnMd ? "minmax(0, 1fr)" : "minmax(0, 1fr) minmax(0, 1fr)",
                lg: "minmax(0, 1fr)",
              },
              gridTemplateAreas: (() => {
                if (showShipmentLevelInstructionsPanel) {
                  return {
                    xs: '"status" "remarks" "shipmentInstr"',
                    md: '"status" "remarks" "shipmentInstr"',
                    lg: '"status" "remarks" "shipmentInstr"',
                  };
                }
                return {
                  xs: '"status" "remarks"',
                  md: '"remarks status" "remarks ."',
                  lg: '"status" "remarks"',
                };
              })(),
            }}
          >
            <Paper
              elevation={1}
              sx={{
                gridArea: "status",
                px: 3,
                py: 2,
                borderRadius: 1,
                ...elevationSx,
                minWidth: 0,
                alignSelf: "start",
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="h6" sx={{ color: "primary.dark" }}>
                    Status
                  </Typography>
                  <Chip
                    icon={
                      <StatusChipIcon
                        sx={{
                          color: `${packingStatusChip.color} !important`,
                          fontSize: packingStatusChip.iconSize,
                          width: packingStatusChip.iconSize,
                          height: packingStatusChip.iconSize,
                        }}
                      />
                    }
                    label={packingStatusChip.label}
                    onClick={
                      packingOrderUiStatus === "onHold"
                        ? (e) => setOnHoldStatusMenuAnchor(e.currentTarget)
                        : undefined
                    }
                    onDelete={
                      packingOrderUiStatus === "onHold"
                        ? (e) => setOnHoldStatusMenuAnchor(e.currentTarget as HTMLElement)
                        : undefined
                    }
                    deleteIcon={
                      packingOrderUiStatus === "onHold" ? (
                        <ExpandMoreIcon sx={{ color: `${packingStatusChip.color} !important` }} />
                      ) : undefined
                    }
                    sx={{
                      bgcolor: packingStatusChip.bgcolor,
                      color: packingStatusChip.color,
                      fontWeight: 500,
                      pl: "12px",
                      pr: "16px",
                      gap: "12px",
                      pt: "8px",
                      pb: "8px",
                      height: "fit-content",
                      "& .MuiChip-label": { pl: "1px", pr: "1px", fontSize: 16, letterSpacing: "0.15px" },
                      borderRadius: 999,
                      border: packingStatusChip.border ? "1px solid" : "none",
                      borderColor: packingStatusChip.borderColor,
                      "& .MuiChip-icon": {
                        ml: 0.5,
                        fontSize: packingStatusChip.iconSize,
                        width: packingStatusChip.iconSize,
                        height: packingStatusChip.iconSize,
                      },
                      "& .MuiChip-deleteIcon": {
                        mr: 0.5,
                        ml: 0.5,
                        fontSize: 20,
                      },
                      cursor: packingOrderUiStatus === "onHold" ? "pointer" : "default",
                      ...(packingOrderUiStatus === "onHold"
                        ? {
                            "&.MuiChip-clickable:hover": {
                              bgcolor: purple[100],
                            },
                            "&.MuiChip-clickable:focus": {
                              bgcolor: purple[100],
                            },
                          }
                        : {}),
                    }}
                  />
                  <Menu
                    anchorEl={onHoldStatusMenuAnchor}
                    open={onHoldStatusMenuOpen}
                    onClose={() => setOnHoldStatusMenuAnchor(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    PaperProps={{
                      sx: {
                        mt: 0.5,
                        minWidth: 190,
                        borderRadius: 1,
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        setOnHoldStatusMenuAnchor(null);
                        if (isSortingStationOrderId(loadedOrderId) || isRobotStationOrderId(loadedOrderId)) {
                          handleLoadOrderFromInput(PROTOTYPE_PACK_ORDER_ID);
                          return;
                        }
                        setPackingOrderUiStatus("readyToPack");
                        if (isPrototypeOnHoldOrderId(loadedOrderId)) {
                          const stayingRemote = remoteFacilityItemIds.filter((id) =>
                            PROTOTYPE_ON_HOLD_REMOTE_FACILITY_ITEM_IDS.includes(id),
                          );
                          setRemoteFacilityItemIds(stayingRemote);
                          const excludeFromMainPack = new Set(stayingRemote);
                          setPackItems((prev) => mergeMissingPackLineItems(prev, excludeFromMainPack));
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 44 }}>
                        <ReadyToPackStatusIcon
                          sx={{
                            color: "action.active",
                            fontSize: 22,
                            width: 22,
                            height: 22,
                          }}
                        />
                      </ListItemIcon>
                      Ready to Pack
                    </MenuItem>
                  </Menu>
                </Stack>
                {packingOrderUiStatus === "onHold" &&
                !isSortingStationView &&
                !isPrototypeHoldLastItemOrderId(loadedOrderId) ? (
                  <Alert
                    data-node-id="2052:23611"
                    severity="info"
                    variant="standard"
                    icon={<InfoOutlinedIcon sx={{ fontSize: 22, color: "#4a148c" }} />}
                    sx={{
                      alignItems: "flex-start",
                      py: 0.75,
                      px: 2,
                      borderRadius: 1,
                      border: "none",
                      boxShadow: "none",
                      bgcolor: "#f3e5f5",
                      color: "#4a148c",
                      "& .MuiAlert-icon": {
                        color: "#4a148c",
                        alignSelf: "flex-start",
                        mr: 1.5,
                        py: 0.875,
                        opacity: 1,
                      },
                      "& .MuiAlert-message": {
                        width: "100%",
                        pt: 1,
                        pb: 1,
                        color: "#4a148c",
                      },
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        fontSize: 14,
                        lineHeight: 1.43,
                        letterSpacing: "0.15px",
                        color: "#4a148c",
                      }}
                    >
                      {ON_HOLD_AWAITING_ITEM_BODY}
                    </Typography>
                  </Alert>
                ) : null}
                {isSimilarOrdersView ? (
                    <Alert
                      severity="info"
                      variant="standard"
                      icon={<InfoOutlinedIcon />}
                      sx={{
                        alignItems: "center",
                        py: 0.75,
                        px: 2,
                        borderRadius: 1,
                        border: "none",
                        boxShadow: "none",
                        bgcolor: lightBlue[50],
                        color: lightBlue[900],
                        "& .MuiAlert-icon": {
                          color: lightBlue[900],
                          alignSelf: "center",
                          mr: 1.5,
                          py: 0.25,
                          opacity: 1,
                        },
                        "& .MuiAlert-message": {
                          width: "100%",
                          pt: 1,
                          pb: 1,
                          color: lightBlue[900],
                          display: "flex",
                          alignItems: "center",
                          minWidth: 0,
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={2}
                        sx={{ width: "100%", minWidth: 0 }}
                      >
                        <AlertTitle
                          sx={{ mb: 0, mt: 0, flex: "1 1 auto", minWidth: 0, pr: 1, lineHeight: 1.43 }}
                        >
                          {isSimilarMultipleOrdersView ? "Similar orders found." : "Similar order found."}
                        </AlertTitle>
                        <Link
                          component="button"
                          type="button"
                          underline="hover"
                          onClick={() => setJoinShipmentDialogOpen(true)}
                          sx={{
                            color: "primary.dark",
                            fontSize: 16,
                            fontWeight: 400,
                            flexShrink: 0,
                          }}
                        >
                          {isSimilarMultipleOrdersView ? "Join Shipments" : "Join Shipment"}
                        </Link>
                      </Stack>
                    </Alert>
                ) : null}
                {packingOrderUiStatus === "packApiFailed" ? (
                    <Alert
                      severity="warning"
                      variant="standard"
                      icon={<ErrorOutlineIcon />}
                      sx={{
                        alignItems: "flex-start",
                        py: 1.5,
                        px: 2,
                        borderRadius: 1,
                        border: "none",
                        boxShadow: "none",
                        bgcolor: orange[50],
                        color: "#663C00",
                        "& .MuiAlert-icon": { color: "error.main", alignItems: "center", pt: 0.25 },
                        "& .MuiAlert-message": { width: "100%", pt: 0.125, color: "#663C00" },
                      }}
                    >
                      <AlertTitle
                        sx={{
                          fontWeight: 600,
                          fontSize: 16,
                          color: "#663C00",
                          mb: 0.5,
                          letterSpacing: "0.15px",
                        }}
                      >
                        {PROTOTYPE_FALLBACK_PACK_ERROR_TITLE}
                      </AlertTitle>
                      <Typography
                        variant="body2"
                        sx={{
                          letterSpacing: "0.15px",
                          lineHeight: 1.43,
                          color: "#663C00",
                          fontWeight: 500,
                        }}
                      >
                        {PROTOTYPE_FALLBACK_PACK_ERROR_DETAIL}
                      </Typography>
                    </Alert>
                ) : null}
                {packingOrderUiStatus === "pending" && sentToFixReason ? (
                    <Alert
                      severity="warning"
                      variant="standard"
                      icon={<InfoOutlinedIcon />}
                      sx={{
                        alignItems: "flex-start",
                        py: 1.5,
                        px: 2,
                        borderRadius: 1,
                        border: "none",
                        boxShadow: "none",
                        bgcolor: orange[50],
                        color: "#663C00",
                        "& .MuiAlert-icon": { color: "warning.main" },
                        "& .MuiAlert-message": { width: "100%", pt: 0.125, color: "#663C00" },
                      }}
                    >
                      <AlertTitle
                        sx={{
                          fontWeight: 600,
                          fontSize: 16,
                          color: "#663C00",
                          mb: 0.5,
                          letterSpacing: "0.15px",
                        }}
                      >
                        Order status details
                      </AlertTitle>
                      <Typography
                        variant="body2"
                        sx={{
                          letterSpacing: "0.15px",
                          whiteSpace: "pre-wrap",
                          lineHeight: 1.5,
                          color: "#663C00",
                        }}
                      >
                        {sentToFixReason}
                      </Typography>
                    </Alert>
                ) : null}
                {packingOrderUiStatus === "cancelled" ? (
                    <Alert
                      severity="error"
                      variant="standard"
                      icon={<CancelOutlinedIcon />}
                      sx={{
                        alignItems: "flex-start",
                        py: 1.5,
                        px: 2,
                        borderRadius: 1,
                        border: "none",
                        boxShadow: "none",
                        bgcolor: red[50],
                        color: "#5F2120",
                        "& .MuiAlert-icon": { color: "error.main" },
                        "& .MuiAlert-message": { width: "100%", pt: 1, color: "#5F2120" },
                      }}
                    >
                      <AlertTitle
                        sx={{
                          fontWeight: 600,
                          fontSize: 16,
                          color: "#5F2120",
                          mb: 0.5,
                          letterSpacing: "0.15px",
                        }}
                      >
                        Order status details
                      </AlertTitle>
                      <Typography
                        variant="body2"
                        sx={{
                          letterSpacing: "0.15px",
                          whiteSpace: "pre-wrap",
                          lineHeight: 1.5,
                          color: "#5F2120",
                        }}
                      >
                        {PROTOTYPE_CANCELLED_STATUS_BODY}
                      </Typography>
                    </Alert>
                ) : null}
              </Stack>
            </Paper>

            <Paper
              elevation={1}
              sx={{
                gridArea: "remarks",
                px: 3,
                py: 2,
                borderRadius: 1,
                ...elevationSx,
                position: "relative",
                minWidth: 0,
                alignSelf: "start",
                boxSizing: "border-box",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
                sx={{ mb: 2, width: "100%", minWidth: 0 }}
              >
                <Typography variant="h6" sx={{ color: "primary.dark", minWidth: 0 }}>
                  Remarks
                </Typography>
                <Link
                  component="button"
                  type="button"
                  underline="hover"
                  sx={{ color: "primary.dark", fontSize: 16, fontWeight: 400, flexShrink: 0 }}
                  onClick={() => openCreateRemarkDialog(null)}
                >
                  Send Message
                </Link>
              </Stack>
              <Box
                sx={{
                  width: "100%",
                  minWidth: 0,
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: "background.paper",
                }}
              >
                <Tabs
                  value={remarksTab}
                  onChange={(_, v: RemarksTabValue) => setRemarksTab(v)}
                  sx={{
                    minHeight: 36,
                    m: 0,
                    p: 0,
                    px: 0.5,
                    boxSizing: "border-box",
                    borderBottom: 1,
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    "& .MuiTabs-flexContainer": { gap: 0.5 },
                    "& .MuiTab-root": {
                      textTransform: "none",
                      fontWeight: 500,
                      minHeight: 36,
                      py: 0.75,
                      px: 1.25,
                    },
                  }}
                >
                  <Tab label="All" value="all" />
                  <Tab label="Packers" value="packing" />
                  <Tab label="CSR" value="csr" />
                </Tabs>
                <Box
                  sx={{
                    maxHeight: 220,
                    overflow: "auto",
                    width: "100%",
                    minWidth: 0,
                    flex: "1 1 auto",
                    boxSizing: "border-box",
                  }}
                >
                  {filteredRemarksMessages.map((m) => (
                    <MessageRow key={m.id} message={m} />
                  ))}
                </Box>
              </Box>
            </Paper>

            {showShipmentLevelInstructionsPanel && (
              <Paper
                elevation={1}
                sx={{
                  gridArea: "shipmentInstr",
                  px: 0,
                  py: 0,
                  borderRadius: 1,
                  ...elevationSx,
                  minWidth: 0,
                  width: "100%",
                  boxSizing: "border-box",
                  alignSelf: "start",
                  overflow: "hidden",
                }}
              >
                <ItemPackingInstructionsCard
                  layout="shipment"
                  prototypeVariants={[PROTOTYPE_SHIPMENT_INSTRUCTIONS, PROTOTYPE_SHIPMENT_INSTRUCTIONS_SINGLE]}
                />
              </Paper>
            )}

          </Box>
        </Stack>
      </Box>
      ) : notFoundQuery ? (
        <NoShipmentsFoundHero
          shippingId={notFoundQuery}
          action={
            HAS_SHIPMENT_RECOVERY_PERMISSION ? (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleStartShipmentRecovery}
                sx={{ py: 1, px: 3 }}
              >
                Start shipment recovery
              </Button>
            ) : undefined
          }
        />
      ) : (
        <EmptyStateHero />
      )}
      {recoveryScenario && (
        <ShipmentRecoveryHubDialog
          open={recoveryHubOpen}
          barcode={recoveryBarcode}
          scenario={recoveryScenario}
          actorName={headerProfileDisplayName}
          currentFacilityId={CURRENT_PACKING_FACILITY_ID}
          onClose={() => setRecoveryHubOpen(false)}
          onLog={appendRecoveryHistory}
          onRecovered={handleRecoveryCompleted}
          onCreateManually={handleOpenManualShipmentCreation}
        />
      )}
      <ManualShipmentCreationDialog
        open={manualShipmentDialogOpen}
        prefillOrderId={manualShipmentPrefillOrderId}
        facilityId={CURRENT_PACKING_FACILITY_ID}
        onClose={() => setManualShipmentDialogOpen(false)}
        onLog={appendRecoveryHistory}
        onCreated={handleManualShipmentCreated}
      />
      <Snackbar
        open={Boolean(recoverySuccessToast)}
        autoHideDuration={6000}
        onClose={() => setRecoverySuccessToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setRecoverySuccessToast(null)}
          sx={{
            alignItems: "center",
            borderRadius: 1,
            fontSize: 15,
            letterSpacing: "0.15px",
            boxShadow:
              "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)",
          }}
        >
          {recoverySuccessToast}
        </Alert>
      </Snackbar>
      <FallbackPackDialog
        open={fallbackPackDialogOpen}
        onClose={() => setFallbackPackDialogOpen(false)}
        onManualPack={({ carrierRouteId, manualTrackingId: tid }) => {
          setActiveCarrierRouteId(carrierRouteId);
          setTrackingManualMode(true);
          setManualTrackingInput(tid);
          manualTrackingLoadedFromApiRef.current = true;
          setFallbackPackSubmitPhase("idle");
          setPackingOrderUiStatus("packed");
              setPackSuccessAnimNonce((n) => n + 1);
        }}
      />
      <CarrierShippingRouteDialog
        open={carrierRouteDialogOpen}
        onClose={() => setCarrierRouteDialogOpen(false)}
        activeRouteId={activeCarrierRouteId}
        onSave={(id) => setActiveCarrierRouteId(id)}
      />
      <AssignStorageDialog
        open={assignStoragePopupItemId != null}
        itemId={assignStoragePopupItemId}
        holdReasonMessage={holdReasonMessage}
        existingAssignments={storageAssignByItemId}
        onClose={handleCloseAssignStorage}
        onConfirmCell={handleConfirmCellAssign}
        onConfirmContainer={handleConfirmContainerAssign}
        // PROTOTYPE ONLY — clicking the subtitle cycles hold states. Drop this prop before shipping.
        onCycleHoldReason={SHOW_HOLD_STATE_PREVIEW ? cycleHoldReasonState : undefined}
      />
      <AssignStorageDialog
        mode="release"
        open={releaseShipmentModalOpen}
        itemId={null}
        releaseLocations={releaseLocations}
        onClose={() => setReleaseShipmentModalOpen(false)}
        onConfirmRelease={handleReleaseShipmentConfirm}
        onConfirmCell={handleConfirmCellAssign}
        onConfirmContainer={handleConfirmContainerAssign}
        // PROTOTYPE ONLY — click a location card to toggle single-cell vs multi-location example.
        onCycleReleaseExample={cycleReleaseExample}
      />
      <UpdateAddressDialog
        open={addressDialogOpen}
        onClose={() => setAddressDialogOpen(false)}
        savedForm={savedShipmentAddress}
        onSave={(form) => {
          setSavedShipmentAddress(form);
          setDestinationDisplay(formatDestinationSummary(form));
        }}
      />
      {loadedOrderId && (
        <OrderHistoryLogDialog
          open={orderHistoryDialogOpen}
          onClose={() => setOrderHistoryDialogOpen(false)}
          orderNumber={displayedOrderNumberForDetails ?? loadedOrderId ?? ""}
        />
      )}
      {loadedOrderId && (
        <ShipmentHistoryLogDialog
          open={shipmentHistoryDialogOpen}
          onClose={() => setShipmentHistoryDialogOpen(false)}
          shipmentId={displayedShipmentId}
          entries={shipmentHistoryEntries}
        />
      )}
      {loadedOrderId && (
        <ShipmentPendingDialog
          open={showShipmentPendingDialog}
          reasonForFix={sentToFixReason ?? ""}
          onOk={handleShipmentPendingOk}
          onCancel={handleShipmentPendingCancel}
        />
      )}
      {loadedOrderId && (
        <SendToFixDialog
          open={sendToFixDialogOpen}
          onClose={() => setSendToFixDialogOpen(false)}
          onSubmit={(reason) => {
            setPackingOrderUiStatus("pending");
            setSentToFixReason(reason);
            setMoreActionsMenuAnchor(null);
          }}
        />
      )}
      {loadedOrderId && (
        <JoinShipmentDialog
          open={joinShipmentDialogOpen}
          onClose={() => setJoinShipmentDialogOpen(false)}
          currentShipmentId={joinDialogShipmentId}
          prefillSourceShipmentId={joinPrefillSourceShipmentId}
          dualSourceShipments={
            isSimilarMultipleOrdersView ? SIMILAR_MULTIPLE_JOIN_SOURCE_SHIPMENTS : null
          }
          onConfirm={(nextCurrentItems) => {
            setPackItems(
              nextCurrentItems.map(({ returnToSourceShipmentId: _returnId, ...x }) => ({
                ...x,
                movable: false,
              })),
            );
                }}
        />
      )}
      {loadedOrderId && (
        <SplitShipmentDialog
          open={splitShipmentDialogOpen}
          onClose={() => setSplitShipmentDialogOpen(false)}
          currentShipmentId={joinDialogShipmentId}
          onConfirm={(nextCurrentItems, nextNewItems, newShipmentId, sourceShipmentId) => {
            skipPackItemsResetAfterSplitConfirmRef.current = true;
            prototypeFallbackSupervisorLoadRef.current = false;
            const originalRows = nextCurrentItems.map((x) => ({ ...x, movable: false }));
            const newRows = nextNewItems.map((x) => ({ ...x, movable: false }));
            setPackItems(originalRows);
            setSplitTabInventories({ original: originalRows, newShipment: newRows });
                  setSplitLinkedPair({
              original: prototypeSplitOriginalShipmentIdForTabs(sourceShipmentId),
              split: normalizeSplitNewShipmentIdForTab(newShipmentId),
            });
            setSplitOrdersTabIndex(0);
            setLoadedOrderId(PROTOTYPE_SPLIT_ORDER_ID);
          }}
        />
      )}
      {loadedOrderId && itemRemarksItemId ? (
        <ItemRemarksDialog
          open
          onClose={() => setItemRemarksItemId(null)}
          itemId={itemRemarksItemId}
          messages={shipmentMessages}
        />
      ) : null}
      {loadedOrderId && (
        <CreateRemarkDialog
          open={createRemarkOpen}
          onClose={() => {
            setCreateRemarkOpen(false);
            setCreateRemarkDefaultItemId(null);
          }}
          defaultItemId={createRemarkDefaultItemId}
          onSend={handleCreateRemarkSend}
        />
      )}
    </Box>
  );
}

/** Filled location card in the "Release shipment" modal — icon, CELL/CONTAINER value, and item count. */
function ReleaseLocationCard({
  location,
  onClick,
}: {
  location: ReleaseLocationCardData;
  onClick?: () => void;
}) {
  const isCell = location.kind === "cell";
  const itemCountLabel = location.itemCount === 1 ? "1 item" : `${location.itemCount} items`;
  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        px: 2,
        py: 1.5,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "primary.main",
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography
          sx={{
            color: "primary.main",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.4px",
            textTransform: "uppercase",
            lineHeight: 1.4,
          }}
        >
          {isCell ? "Cell" : "Container"}
        </Typography>
        <Typography
          sx={{
            color: "primary.main",
            fontSize: 20,
            fontWeight: 700,
            lineHeight: 1.2,
            wordBreak: "break-word",
          }}
        >
          {location.value}
        </Typography>
      </Box>
      <Typography sx={{ color: "primary.main", fontSize: 14, flexShrink: 0 }}>
        {itemCountLabel}
      </Typography>
    </Box>
  );
}

/**
 * Assign-storage control in the item header row: an "Assign storage" button when the line is
 * unassigned, or an outlined-primary pill (cell / container) with a release ✕ once assigned.
 * The popup itself lives in {@link AssignStorageDialog}; this only opens it.
 */
function ItemStorageAssign({
  assignment,
  disabled = false,
  onAssignClick,
  onRelease,
}: {
  assignment: StorageAssignment | null;
  /** Dimmed idle state while another line's popup is open (only one popup at a time). */
  disabled?: boolean;
  onAssignClick: () => void;
  onRelease: () => void;
}) {
  if (assignment != null) {
    return (
      <Chip
        variant="outlined"
        color="primary"
        size="medium"
        label={storageAssignmentLabel(assignment)}
        onDelete={onRelease}
        deleteIcon={
          <Tooltip title="Release item">
            <ExitToAppOutlinedIcon aria-label="Release item" />
          </Tooltip>
        }
        sx={{
          borderRadius: "999px",
          height: 40,
          fontWeight: 500,
          letterSpacing: "0.15px",
          px: "8px",
          "& .MuiChip-label": { px: 1.25, fontSize: 14 },
          "& .MuiChip-deleteIcon": { fontSize: 20, color: "primary.main", "&:hover": { color: "primary.dark" } },
        }}
      />
    );
  }

  return (
    <Button
      variant="outlined"
      color="primary"
      size="small"
      disabled={disabled}
      onClick={onAssignClick}
      startIcon={<DocumentScannerOutlinedIcon sx={{ fontSize: 18 }} />}
      sx={{
        textTransform: "uppercase",
        letterSpacing: "0.4px",
        flexShrink: 0,
        py: "6px",
        px: "16px",
      }}
    >
      Assign storage
    </Button>
  );
}

/**
 * "Assign storage" popup: pick the system-suggested cell or scan a container barcode.
 * Cell is pre-selected; when no cell is free the cell option is disabled and container auto-selected.
 * If another line in the same order is already stored, that cell/container is recommended instead so
 * the order stays together (a sibling container pre-fills and selects the scan option).
 */
function AssignStorageDialog({
  open,
  itemId,
  mode = "assign",
  holdReasonMessage = "",
  releaseLocations = [],
  existingAssignments = {},
  onClose,
  onConfirmCell,
  onConfirmContainer,
  onConfirmRelease,
  onCycleHoldReason,
  onCycleReleaseExample,
}: {
  open: boolean;
  itemId: string | null;
  /** "assign" = pick a cell/container for one item; "release" = shipment-level release (no radios). */
  mode?: "assign" | "release";
  /** Hold-reason description sentence shown as the subtitle (why storage is being assigned). */
  holdReasonMessage?: string;
  /** Release variant: the cells/containers to collect the shipment's items from, shown as cards. */
  releaseLocations?: ReleaseLocationCardData[];
  /** Confirmed assignments for the other lines in this order — used to recommend the same cell/container. */
  existingAssignments?: Record<string, StorageAssignment>;
  onClose: () => void;
  onConfirmCell: (itemId: string, cell: number) => void;
  onConfirmContainer: (itemId: string, barcode: string) => void;
  /** Release variant confirm — lift the hold. */
  onConfirmRelease?: () => void;
  /** PROTOTYPE ONLY — when set, clicking the subtitle cycles through the hold-reason states. */
  onCycleHoldReason?: () => void;
  /** PROTOTYPE ONLY — when set, clicking a release location card toggles the example. */
  onCycleReleaseExample?: () => void;
}) {
  const isRelease = mode === "release";
  // All lines belong to the same order → if a sibling is already stored somewhere, keep this item with it.
  const siblingAssignment = useMemo<StorageAssignment | null>(() => {
    for (const [id, assignment] of Object.entries(existingAssignments)) {
      if (id !== itemId) return assignment;
    }
    return null;
  }, [existingAssignments, itemId]);
  const siblingCell = siblingAssignment?.kind === "cell" ? siblingAssignment.cell : null;
  const siblingContainer = siblingAssignment?.kind === "container" ? siblingAssignment.barcode : null;

  const systemSuggestedCell = itemId != null ? getSuggestedCellForItem(itemId) : null;
  // Prefer the sibling's cell so the order stays together; otherwise fall back to the system suggestion.
  const suggestedCell = siblingCell ?? systemSuggestedCell;
  const noFreeCell = suggestedCell == null;

  const [choice, setChoice] = useState<"cell" | "container">("cell");
  const [barcode, setBarcode] = useState("");

  // Reset the draft each time the popup opens (for a possibly different line).
  useEffect(() => {
    if (!open) return;
    // A sibling already scanned into a container → default to that container, pre-filled.
    if (siblingContainer != null) {
      setChoice("container");
      setBarcode(siblingContainer);
      return;
    }
    setChoice(noFreeCell ? "container" : "cell");
    setBarcode("");
  }, [open, itemId, noFreeCell, siblingContainer]);

  const containerReady = barcode.trim().length >= 4;

  const confirm = () => {
    if (itemId == null) return;
    if (choice === "cell" && suggestedCell != null) {
      onConfirmCell(itemId, suggestedCell);
    } else if (choice === "container" && containerReady) {
      onConfirmContainer(itemId, barcode.trim());
    }
  };

  // Hardware scanners terminate the barcode with Enter — treat that as a confirm.
  const handleBarcodeKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key === "Enter" && containerReady) {
      event.preventDefault();
      confirm();
    }
  };

  const okDisabled = choice === "cell" ? noFreeCell : !containerReady;
  const okLabel =
    choice === "cell"
      ? `Assign to cell — ${suggestedCell ?? ""}`.trim()
      : containerReady
        ? "Assign to container"
        : "Waiting for scan…";

  const optionCardSx = (selected: boolean, cardDisabled: boolean) => ({
    border: "1px solid",
    borderColor: selected ? "primary.main" : "divider",
    borderRadius: 1,
    bgcolor: (theme: Theme) => (selected ? alpha(theme.palette.primary.main, 0.06) : theme.palette.background.paper),
    px: 2,
    py: 0.5,
    opacity: cardDisabled ? 0.6 : 1,
    "& .MuiFormControlLabel-root": { width: "100%", m: 0, py: 0.5 },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      // ~15% wider than the default "xs" (444px) breakpoint.
      sx={{ "& .MuiDialog-paper": { maxWidth: 512 } }}
    >
      <StandardDialogTitle onClose={onClose}>
        {isRelease ? "Release shipment" : "Assign storage"}
      </StandardDialogTitle>
      <DialogContent sx={{ pt: 1, pb: 2 }}>
        <Stack spacing={2}>
          {isRelease ? (
            <>
              <Typography variant="body1" color="text.primary">
                All items are accounted for. Collect from:
              </Typography>
              <Stack spacing={1.5}>
                {releaseLocations.map((location, idx) => (
                  <ReleaseLocationCard
                    key={`${location.kind}-${location.value}-${idx}`}
                    location={location}
                    onClick={onCycleReleaseExample}
                  />
                ))}
              </Stack>
            </>
          ) : (
            <Typography
              variant="body1"
              color="text.primary"
              onClick={onCycleHoldReason}
              sx={onCycleHoldReason ? { cursor: "pointer" } : undefined}
            >
              {holdReasonMessage}
            </Typography>
          )}

          {!isRelease && siblingAssignment != null ? (
            <Alert severity="info" icon={<Inventory2OutlinedIcon fontSize="inherit" />} sx={{ py: 0.5 }}>
              Another item from this shipment is already in{" "}
              <Box component="span" sx={{ fontWeight: 700 }}>
                {siblingCell != null ? `cell ${siblingCell}` : `container ${siblingContainer}`}
              </Box>
              .
            </Alert>
          ) : null}

          {!isRelease && noFreeCell ? (
            <Alert severity="warning" sx={{ py: 0.5 }}>
              No free cell — all {PROTOTYPE_TOTAL_CELL_COUNT} cells occupied.
            </Alert>
          ) : null}

          {!isRelease ? (
          <RadioGroup
            value={choice}
            onChange={(e) => setChoice(e.target.value as "cell" | "container")}
          >
            <Stack spacing={1.5}>
              <Box sx={{ ...optionCardSx(choice === "cell", noFreeCell), "& .MuiFormControlLabel-label": { flexGrow: 1 } }}>
                <FormControlLabel
                  value="cell"
                  disabled={noFreeCell}
                  control={<Radio />}
                  label={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: "100%",
                        gap: 1,
                      }}
                    >
                      <Typography component="span">Put in cell</Typography>
                      {noFreeCell ? null : (
                        <Typography
                          component="span"
                          sx={{ color: "primary.main", fontWeight: 700, fontSize: 18, lineHeight: 1 }}
                        >
                          {suggestedCell}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </Box>
              <Box sx={optionCardSx(choice === "container", false)}>
                <FormControlLabel value="container" control={<Radio />} label="Scan to Container" />
                <Collapse in={choice === "container"} unmountOnExit>
                  <Box sx={{ pl: 4, pr: 0.5, pb: 0.5, pt: 0.5 }}>
                    <TextField
                      fullWidth
                      size="small"
                      autoFocus
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      onKeyDown={handleBarcodeKeyDown}
                      placeholder="Scan container barcode…"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DocumentScannerOutlinedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 0.75 }}
                    >
                      Popup closes automatically once a barcode is detected.
                    </Typography>
                  </Box>
                </Collapse>
              </Box>
            </Stack>
          </RadioGroup>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pt: 2, pb: 3, justifyContent: "space-between", alignItems: "center" }}>
        <Button variant="text" onClick={onClose} sx={{ color: "text.secondary" }}>
          Cancel
        </Button>
        {isRelease ? (
          <Button variant="contained" onClick={onConfirmRelease}>
            Release shipment
          </Button>
        ) : (
          <Button variant="contained" disabled={okDisabled} onClick={confirm}>
            {okLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

function ItemBlock({
  title,
  image,
  imageRadius,
  imageOverlay,
  details,
  packaging,
  itemId,
  itemRemarkCount = 0,
  onItemRemarksClick,
  titleRowEnd,
  assignRowLeading,
  showHoldAssignDefault = false,
  remoteFacilityTitleRow = false,
  robotCellAssignUi = false,
  storageAssignByItemId = {},
  assignStoragePopupItemId = null,
  onOpenAssignStorage = () => {},
  onReleaseStorage = () => {},
}: {
  title: string;
  image: string;
  imageRadius?: number;
  imageOverlay?: boolean;
  details: ReactNode;
  packaging: ReactNode | null;
  itemId?: string;
  itemRemarkCount?: number;
  onItemRemarksClick?: () => void;
  /** e.g. “Item received” control (Figma 2052:23611). */
  titleRowEnd?: ReactNode;
  /** Rendered inside the right-aligned assign row, before the "Assign storage" button (e.g. a kept "Item Received" checkbox). */
  assignRowLeading?: ReactNode;
  /** Figma 1664:18640 — show hold / container assign control (on-hold shipment). */
  showHoldAssignDefault?: boolean;
  /** Other-facilities row: no container assign; remarks after title; `titleRowEnd` (e.g. Item Received) aligned to the row end. */
  remoteFacilityTitleRow?: boolean;
  /** Robot prototype (`robot` search): sort assign row shows the "Robot Station" chip before the control. */
  robotCellAssignUi?: boolean;
  /** Assign-storage flow — per line item, the confirmed cell/container assignment. */
  storageAssignByItemId?: Record<string, StorageAssignment>;
  /** Item id whose popup is open (dims other lines' idle buttons until confirmed). */
  assignStoragePopupItemId?: string | null;
  onOpenAssignStorage?: (itemId: string) => void;
  onReleaseStorage?: (itemId: string) => void;
}) {
  const canOpenRemarks = itemRemarkCount > 0;
  const premiumGiftKitItemId = PACK_LINE_ITEM_META[2].id;
  const showItemRemarksControl =
    itemId != null &&
    onItemRemarksClick != null &&
    (itemRemarkCount > 0 || itemId !== premiumGiftKitItemId);

  /** Gift packaging lines (e.g. Premium Gift Kit) are never assigned to containers. */
  const shouldShowHoldAssign =
    Boolean(showHoldAssignDefault) && itemId !== premiumGiftKitItemId && !remoteFacilityTitleRow;

  const titleRowAlignCenter =
    shouldShowHoldAssign || remoteFacilityTitleRow || (Boolean(showHoldAssignDefault) && itemId === premiumGiftKitItemId);

  const remarksControl =
    showItemRemarksControl ? (
      <Tooltip title={`Item remarks (${itemRemarkCount})`}>
        <Box component="span" sx={{ flexShrink: 0, alignSelf: "flex-start" }}>
          <IconButton
            aria-label={`Item remarks (${itemRemarkCount})`}
            disabled={!canOpenRemarks}
            onClick={(e) => {
              e.stopPropagation();
              if (!canOpenRemarks) return;
              onItemRemarksClick();
            }}
            size="small"
            sx={{
              flexShrink: 0,
              alignSelf: "flex-start",
              mt: -0.25,
              bgcolor: "background.paper",
              boxShadow: "none",
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            <Badge
              color="primary"
              variant="dot"
              invisible={itemRemarkCount === 0}
              sx={{
                "& .MuiBadge-badge": {
                  minWidth: 6,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  padding: 0,
                  fontSize: 0,
                  lineHeight: 0,
                  top: 4,
                  right: 4,
                  backgroundColor: "rgba(1, 87, 155, 1)",
                  boxShadow: (theme) => `0 0 0 1px ${theme.palette.background.paper}`,
                },
              }}
            >
              <ChatBubbleOutlineIcon sx={{ fontSize: 20 }} />
            </Badge>
          </IconButton>
        </Box>
      </Tooltip>
    ) : null;

  return (
    <Stack spacing={2} sx={{ width: "100%", alignSelf: "stretch" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          alignItems: titleRowAlignCenter ? "center" : "flex-start",
          width: "100%",
          gap: 1,
          rowGap: 1,
        }}
      >
        <Box
          sx={{
            flex: "0 1 auto",
            minWidth: 0,
            maxWidth: "100%",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: titleRowAlignCenter ? "center" : "flex-start",
            gap: 1,
            columnGap: 1,
            rowGap: 0.5,
            pr: shouldShowHoldAssign || remoteFacilityTitleRow ? 0 : 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: titleRowAlignCenter ? "center" : "flex-start",
              columnGap: "16px",
              rowGap: 0.5,
              minWidth: 0,
              maxWidth: "100%",
            }}
          >
            <Typography
              variant="body1"
              color="text.primary"
              sx={{
                flex: "0 1 auto",
                minWidth: 0,
                maxWidth: "100%",
                width: "fit-content",
                display: "block",
                wordBreak: "break-word",
              }}
            >
              {title}
            </Typography>
            {remarksControl}
          </Box>
          {!remoteFacilityTitleRow && shouldShowHoldAssign && titleRowEnd != null ? (
            <Box sx={{ flexShrink: 0 }}>{titleRowEnd}</Box>
          ) : !remoteFacilityTitleRow &&
            !shouldShowHoldAssign &&
            !(showHoldAssignDefault && itemId === premiumGiftKitItemId) &&
            titleRowEnd != null ? (
            <Box sx={{ flexShrink: 0 }}>{titleRowEnd}</Box>
          ) : null}
        </Box>
        {remoteFacilityTitleRow && titleRowEnd != null ? (
          <Box
            sx={{
              flexShrink: 0,
              ml: { xs: 0, sm: "auto" },
              alignSelf: "center",
            }}
          >
            {titleRowEnd}
          </Box>
        ) : null}
        {shouldShowHoldAssign ? (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              flexShrink: 0,
              ml: { xs: 0, sm: "auto" },
              maxWidth: "100%",
              alignSelf: "center",
            }}
          >
            {assignRowLeading != null ? (
              <Box sx={{ flexShrink: 0 }}>{assignRowLeading}</Box>
            ) : null}
            {robotCellAssignUi ? (
              <>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{
                    px: 2,
                    minHeight: 40,
                    borderRadius: "4px",
                    bgcolor: purple[50],
                    flexShrink: 0,
                    boxSizing: "border-box",
                  }}
                >
                  <PrecisionManufacturingIcon sx={{ fontSize: 20, color: "#4A148C" }} />
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 500,
                      lineHeight: 1.5,
                      letterSpacing: "0.15px",
                      color: "#4A148C",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Robot Station
                  </Typography>
                </Stack>
                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              </>
            ) : null}
            {itemId != null ? (
              <ItemStorageAssign
                assignment={storageAssignByItemId[itemId] ?? null}
                disabled={assignStoragePopupItemId != null && assignStoragePopupItemId !== itemId}
                onAssignClick={() => onOpenAssignStorage(itemId)}
                onRelease={() => onReleaseStorage(itemId)}
              />
            ) : null}
          </Stack>
        ) : null}
      </Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 3, md: 4 }}
        alignItems="flex-start"
        sx={{ width: "100%" }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: 200 },
            maxWidth: 200,
            aspectRatio: "1",
            height: { xs: "auto", sm: 200 },
            flexShrink: 0,
            borderRadius: imageRadius ?? 1.5,
            overflow: "hidden",
            position: "relative",
            alignSelf: { xs: "center", md: "flex-start" },
          }}
        >
          <Box
            component="img"
            src={image}
            alt=""
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              ...(imageOverlay && {
                filter: "brightness(0.97)",
              }),
            }}
          />
          {imageOverlay && (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                bgcolor: "#f8f8f8",
                mixBlendMode: "multiply",
                pointerEvents: "none",
              }}
            />
          )}
        </Box>

        <Stack
          direction={{ xs: "column", xl: "row" }}
          flex={1}
          alignItems="flex-start"
          spacing={{ xs: 2, xl: 0 }}
          sx={{
            width: "100%",
            minWidth: 0,
          }}
        >
          <Stack
            spacing={0.5}
            sx={{
              flex: packaging ? { xl: "1 1 0%" } : "1 1 auto",
              minWidth: 0,
              width: "100%",
              boxSizing: "border-box",
              pr: { xl: packaging ? 3 : 0 },
              pb: packaging ? { xs: 2, xl: 0 } : 0,
              borderBottom: "none",
            }}
          >
            {details}
          </Stack>
          {packaging && (
            <Stack
              spacing={0.5}
              sx={{
                flex: { xl: "0 0 auto" },
                width: { xs: "100%", xl: "fit-content" },
                maxWidth: "100%",
                minWidth: 0,
                alignSelf: { xl: "flex-start" },
                boxSizing: "border-box",
                pl: { xl: 3 },
              }}
            >
              {packaging}
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

function MessageRow({ message }: { message: ShipmentMessage }) {
  const time = formatRemarkRowDisplayTime(message.at);
  const productSecondaryLine =
    message.itemLabel === REMARK_ALL_PRODUCTS_LABEL ? null : `Item: ${remarkProductDisplayLine(message.itemLabel)}`;

  return (
    <Box
      sx={{
        px: 2,
        py: 1.5,
        borderBottom: "1px solid",
        borderColor: "divider",
        width: "100%",
        minWidth: 0,
        boxSizing: "border-box",
        "&:last-child": { borderBottom: "none" },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1.5}
        sx={{ mb: 1, width: "100%", minWidth: 0 }}
      >
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" sx={{ minWidth: 0, gap: 0.75 }}>
          <Typography variant="body2" color="text.primary" fontWeight={600} sx={{ minWidth: 0 }}>
            {message.author}
          </Typography>
          {message.senderRole === "csr" ? (
            <Chip
              size="small"
              label="CSR"
              variant="filled"
              sx={{
                height: 22,
                bgcolor: purple[50],
                color: purple[900],
                fontWeight: 500,
                border: "none",
                "& .MuiChip-label": { px: 1, fontSize: 12 },
              }}
            />
          ) : null}
          {message.senderRole === "packer" ? (
            <Chip
              size="small"
              label="Packers"
              variant="filled"
              sx={{
                height: 22,
                bgcolor: "#e3f2fd",
                color: "#1565c0",
                fontWeight: 500,
                border: "none",
                "& .MuiChip-label": { px: 1, fontSize: 12 },
              }}
            />
          ) : null}
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0, textAlign: "right", lineHeight: 1.3 }}>
          {time}
        </Typography>
      </Stack>
      {productSecondaryLine ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1,
            fontSize: 13,
            lineHeight: 1.43,
            letterSpacing: "0.15px",
          }}
        >
          {productSecondaryLine}
        </Typography>
      ) : null}
      <Typography variant="body2" color="text.primary" sx={{ width: "100%", wordBreak: "break-word", overflowWrap: "anywhere" }}>
        {message.body}
      </Typography>
    </Box>
  );
}
