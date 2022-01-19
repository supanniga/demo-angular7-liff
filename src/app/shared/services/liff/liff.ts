import { LiffMenuColorSetting } from '@liff/types';
import { Hooks, Liff } from '@liff/liff-types';
import { getAccessToken, getContext, getIDToken, getDecodedIDToken, getAId, getProfilePlus, getIsVideoAutoPlay } from '@liff/store';
import { isInClient } from '@liff/is-in-client';
import { ready } from '@liff/ready';
import { getOS } from '@liff/get-os';
import { getVersion } from '@liff/get-version';
import { getLanguage } from '@liff/get-language';
import { getProfile } from '@liff/get-profile';
import { isLoggedIn } from '@liff/is-logged-in';
import { logout } from '@liff/logout';
import { dispatch, call, postMessage, addListener, removeListener } from '@liff/native-bridge';
import { getLineVersion } from '@liff/get-line-version';
import { isApiAvailable } from '@liff/is-api-available';
import { openWindow } from '@liff/open-window';
import { closeWindow } from '@liff/close-window';
import { sendMessages } from '@liff/send-messages';
import { getFriendship } from '@liff/get-friendship';
import { subWindow } from '@liff/sub-window';
import { HookFunc, SyncHookFunc, LiffPlugin } from '@liff/use';
import { ExtendLiffCore as ExtendLiffCoreInit } from '@liff/init';
import { ExtendLiffCore as ExtendLiffCoreLogin, Option } from '@liff/login';
import { ExtendLiffCore as ExtendLiffCoreAnalytics } from '@liff/analytics';
import { ExtendLiffCorePermanentLink } from '@liff/permanent-link';
import { ExtendLiffCore as ExtendLiffCorePermission } from '@liff/permission';
import { ExtendLiffCore as ExtendLiffCoreIsInSubWindow } from '@liff/is-sub-window';
import { ExtendLiffCore as ExtendLiffCoreShareTargetPicker } from '@liff/share-target-picker';
import { ExtendLiffCore as ExtendLiffCoreScanCodeV2 } from '@liff/scan-code-v2';

export type PluginName = 'bluetooth';
export type OS = 'ios' | 'android' | 'web' | undefined;
export interface AIdInterface {
    id: string;
    t: boolean;
    att?: number;
    skadids?: string;
    atskadvt?: string;
}
export interface ProfilePlusInterface {
    regionCode: string;
}
export type ShareTargetPickerOptions = {
    isMultiple?: boolean;
};

export interface ShareTargetPickerResult {
    status: 'success';
}

export interface Context {
    type: 'utou' | 'room' | 'group' | 'none' | 'square_chat' | 'external';
    utouId?: string;
    roomId?: string;
    groupId: string;
    userId?: string;
    endpointUrl: string;
    viewType?: 'compact' | 'tall' | 'full' | 'cover' | 'frame' | 'new full' | 'full flex';
    accessTokenHash?: string;
    permanentLinkPattern?: 'concat';
    tid?: string;
    squareId?: string;
    squareChatId?: string;
    squareMemberId?: string;
    profilePlus?: ProfilePlusInterface;
    d?: {
        autoplay: boolean;
        aId: AIdInterface;
    };
    availability: {
        shareTargetPicker: {
            permission: boolean;
            minVer: string;
            unsupportedFromVer?: string;
        };
        multipleLiffTransition: {
            permission: boolean;
            minVer: string;
            unsupportedFromVer?: string;
        };
        subwindowOpen: {
            permission: boolean;
            minVer: string;
            unsupportedFromVer?: string;
        };
        scanCode: {
            permission: boolean;
            minVer: string;
            unsupportedFromVer?: string;
        };
        scanCodeV2: {
            permission: boolean;
            minVer: string;
            minOsVer: string;
        };
        getAdvertisingId: {
            permission: boolean;
            minVer: string;
            unsupportedFromVer?: string;
        };
        addToHomeScreen: {
            permission: boolean;
            minVer: string;
            unsupportedFromVer?: string;
        };
        bluetoothLeFunction: {
            permission: boolean;
            minVer: string;
            unsupportedFromVer?: string;
        };
        skipChannelVerificationScreen: {
            permission: boolean;
            minVer: string;
        };
    };
    utsTracking?: {
        mode: 'force' | 'auto' | 'none';
        sendRatio: number;
    };
    menuColorSetting?: {
        adaptableColorSchemes: Array<'light' | 'dark'>;
        lightModeColor?: LiffMenuColorSetting;
        darkModeColor?: LiffMenuColorSetting;
    };
    scope: Array<ElementType<typeof PERMISSION_NAMES>>;
}
export const PERMISSION_NAMES = ["profile", "chat_message.write", "openid", "email"];
export type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<infer ElementType> ? ElementType : never;

export interface OpenWindowParams {
    url: string;
    external?: boolean;
}
export interface Friendship {
    friendFlag: boolean;
}
export interface JWTPayload {
    iss?: string;
    sub?: string;
    aud?: string;
    exp?: number;
    iat?: number;
    auth_time?: number;
    nonce?: string;
    amr?: string[];
    name?: string;
    picture?: string;
    email?: string;
}
export type Permission = 'profile' | 'chat_message.write' | 'openid' | 'email';
export interface LiffError {
    code: string;
    message: string;
}
export interface PermissionStatus {
    state: 'granted' | 'prompt' | 'unavailable';
}
export enum CompareVersion {
    EQUAL = 0,
    GREATER_THAN = 1,
    LESS_THAN = -1,
    UNKNOWN = 99,
}
export type SendMessagesParams = LiffMessage[];
// export type LiffMessage = TextMessage | ImageMessage | VideoMessage | AudioMessage | LocationMessage | StickerMessage | CTemplateMessage | CFlexMessage;
export type LiffMessage = TextMessage | ImageMessage | VideoMessage | AudioMessage | LocationMessage | StickerMessage;
export interface Config {
    channelAccessToken?: string;
    channelSecret?: string;
}
// export interface ClientConfig extends Config {
//     channelAccessToken: string;
//     httpConfig?: Partial<AxiosRequestConfig>;
// }
export interface MiddlewareConfig extends Config {
    channelSecret: string;
}
// export type Profile = {
//     displayName: string;
//     userId: string;
//     pictureUrl: string;
//     statusMessage: string;
//     language?: string;
// };
export interface Profile {
    userId: string;
    displayName: string;
    pictureUrl?: string;
    statusMessage?: string;
}
export type WebhookRequestBody = {
    destination: string;
    events: Array<WebhookEvent>;
};
export type WebhookEvent =
    | MessageEvent
    | UnsendEvent
    | FollowEvent
    | UnfollowEvent
    | JoinEvent
    | LeaveEvent
    | MemberJoinEvent
    | MemberLeaveEvent
    | PostbackEvent
    | VideoPlayCompleteEvent
    | BeaconEvent
    | AccountLinkEvent
    | DeviceLinkEvent
    | DeviceUnlinkEvent
    | LINEThingsScenarioExecutionEvent;
export type EventBase = {
    mode: "active" | "standby";
    timestamp: number;
    source: EventSource;
};
export type EventSource = User | Group | Room;
export type User = { type: "user"; userId: string };
export type Group = {
    type: "group";
    groupId: string;
    userId?: string;
};
export type Room = {
    type: "room";
    roomId: string;
    userId?: string;
};
export type ReplyableEvent = EventBase & { replyToken: string };
export type MessageEvent = {
    type: "message";
    message: EventMessage;
} & ReplyableEvent;
export type UnsendEvent = {
    type: "unsend";
    unsend: { messageId: string };
} & EventBase;
export type FollowEvent = { type: "follow" } & ReplyableEvent;
export type UnfollowEvent = { type: "unfollow" } & EventBase;
export type JoinEvent = { type: "join" } & ReplyableEvent;
export type LeaveEvent = { type: "leave" } & EventBase;
export type MemberJoinEvent = {
    type: "memberJoined";
    joined: { members: Array<User> };
} & ReplyableEvent;
export type MemberLeaveEvent = {
    type: "memberLeft";
    left: { members: Array<User> };
} & EventBase;
export type PostbackEvent = {
    type: "postback";
    postback: Postback;
} & ReplyableEvent;
export type VideoPlayCompleteEvent = {
    type: "videoPlayComplete";
    videoPlayComplete: { trackingId: string };
} & ReplyableEvent;
export type BeaconEvent = ReplyableEvent & {
    type: "beacon";
    beacon: {
        type: "enter" | "leave" | "banner" | "stay";
        hwid: string;
        dm?: string;
    };
};
export type AccountLinkEvent = ReplyableEvent & {
    type: "accountLink";
    link: {
        result: "ok" | "failed";
        nonce: string;
    };
};
export type DeviceLinkEvent = ReplyableEvent & {
    type: "things";
    things: {
        deviceId: string;
        type: "link";
    };
};
export type DeviceUnlinkEvent = ReplyableEvent & {
    type: "things";
    things: {
        deviceId: string;
        type: "unlink";
    };
};
export type LINEThingsScenarioExecutionEvent = ReplyableEvent & {
    type: "things";
    things: {
        type: "scenarioResult";
        deviceId: string;
        result: {
            scenarioId: string;
            revision: number;
            startTime: number;
            endtime: number;
            resultCode: "success" | "gatt_error" | "runtime_error";
            actionResults: Array<LINEThingsActionResult>;
            bleNotificationPayload?: string;
            errorReason?: string;
        };
    };
};
export type LINEThingsActionResult = {
    type: "void" | "binary";
    data?: string;
};
export type EventMessage =
    | TextEventMessage
    | ImageEventMessage
    | VideoEventMessage
    | AudioEventMessage
    | LocationEventMessage
    | FileEventMessage
    | StickerEventMessage;
export type EventMessageBase = { id: string };
export type TextEventMessage = {
    type: "text";
    text: string;
    emojis?: {
        index: number;
        length: number;
        productId: string;
        emojiId: string;
    }[];
    mention?: {
        mentionees: {
            index: number;
            length: number;
            userId: string;
        }[];
    };
} & EventMessageBase;
export type ContentProvider<WithPreview extends boolean = true> =
    | {
        type: "line";
    }
    | {
        type: "external";
        originalContentUrl: string;
        previewImageUrl: WithPreview extends true ? string : undefined;
    };
export type ImageEventMessage = {
    type: "image";
    contentProvider: ContentProvider;
} & EventMessageBase;
export type VideoEventMessage = {
    type: "video";
    contentProvider: ContentProvider;
} & EventMessageBase;
export type AudioEventMessage = {
    type: "audio";
    duration: number;
    contentProvider: ContentProvider<false>;
} & EventMessageBase;
export type FileEventMessage = {
    type: "file";
    fileName: string;
    fileSize: string;
} & EventMessageBase;
export type LocationEventMessage = {
    type: "location";
    title: string;
    address: string;
    latitude: number;
    longitude: number;
} & EventMessageBase;
export type StickerEventMessage = {
    type: "sticker";
    packageId: string;
    stickerId: string;
    stickerResourceType:
    | "STATIC"
    | "ANIMATION"
    | "SOUND"
    | "ANIMATION_SOUND"
    | "POPUP"
    | "POPUP_SOUND"
    | "NAME_TEXT"
    | "PER_STICKER_TEXT";
    keywords: string[];
} & EventMessageBase;
export type Postback = {
    data: string;
    params?: DateTimePostback | RichMenuSwitchPostback;
};
type DateTimePostback = {
    date?: string;
    time?: string;
    datetime?: string;
};
type RichMenuSwitchPostback = {
    newRichMenuAliasId: string;
    status:
    | "SUCCESS"
    | "RICHMENU_ALIAS_ID_NOTFOUND"
    | "RICHMENU_NOTFOUND"
    | "FAILED";
};
export type Message =
    | TextMessage
    | ImageMessage
    | VideoMessage
    | AudioMessage
    | LocationMessage
    | StickerMessage
    | ImageMapMessage
    | TemplateMessage
    | FlexMessage;
export type MessageCommon = {
    quickReply?: QuickReply;
    sender?: Sender;
};
export type TextMessage = MessageCommon & {
    type: "text";
    text: string;
    emojis?: {
        index: number;
        productId: string;
        emojiId: string;
    }[];
};
export type ImageMessage = MessageCommon & {
    type: "image";
    originalContentUrl: string;
    previewImageUrl: string;
};
export type VideoMessage = MessageCommon & {
    type: "video";
    originalContentUrl: string;
    previewImageUrl: string;
};
export type AudioMessage = MessageCommon & {
    type: "audio";
    originalContentUrl: string;
    duration: number;
};
export type LocationMessage = MessageCommon & {
    type: "location";
    title: string;
    address: string;
    latitude: number;
    longitude: number;
};
export type StickerMessage = MessageCommon & {
    type: "sticker";
    packageId: string;
    stickerId: string;
};
export type ImageMapMessage = MessageCommon & {
    type: "imagemap";
    baseUrl: string;
    altText: string;
    baseSize: Size;
    video?: {
        originalContentUrl: string;
        previewImageUrl: string;
        area: Area;
        externalLink?: {
            linkUri: string;
            label: string;
        };
    };
    actions: ImageMapAction[];
};
export type TemplateMessage = MessageCommon & {
    type: "template";
    altText: string;
    template: TemplateContent;
};
export type FlexMessage = MessageCommon & {
    type: "flex";
    altText: string;
    contents: FlexContainer;
};
export type ImageMapAction = ImageMapURIAction | ImageMapMessageAction;
export type ImageMapActionBase = {
    label?: string;
    area: Area;
};
export type ImageMapURIAction = {
    type: "uri";
    linkUri: string;
} & ImageMapActionBase;
export type ImageMapMessageAction = {
    type: "message";
    text: string;
} & ImageMapActionBase;
export type Area = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export type FlexContainer = FlexBubble | FlexCarousel;
export type FlexBubble = {
    type: "bubble";
    size?: "nano" | "micro" | "kilo" | "mega" | "giga";
    direction?: "ltr" | "rtl";
    header?: FlexBox;
    hero?: FlexBox | FlexImage;
    body?: FlexBox;
    footer?: FlexBox;
    styles?: FlexBubbleStyle;
    action?: Action;
};
export type FlexBubbleStyle = {
    header?: FlexBlockStyle;
    hero?: FlexBlockStyle;
    body?: FlexBlockStyle;
    footer?: FlexBlockStyle;
};
export type FlexBlockStyle = {
    backgroundColor?: string;
    separator?: boolean;
    separatorColor?: string;
};
export type FlexCarousel = {
    type: "carousel";
    contents: FlexBubble[];
};
export type FlexComponent =
    | FlexBox
    | FlexButton
    | FlexImage
    | FlexIcon
    | FlexText
    | FlexSpan
    | FlexSeparator
    | FlexFiller
    | FlexSpacer;
export type FlexBox = {
    type: "box";
    layout: "horizontal" | "vertical" | "baseline";
    contents: FlexComponent[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?:
    | string
    | "none"
    | "light"
    | "normal"
    | "medium"
    | "semi-bold"
    | "bold";
    cornerRadius?: string | "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
    width?: string;
    height?: string;
    flex?: number;
    spacing?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
    margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
    paddingAll?: string;
    paddingTop?: string;
    paddingBottom?: string;
    paddingStart?: string;
    paddingEnd?: string;
    action?: Action;
    justifyContent?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
    alignItems?: "flex-start" | "center" | "flex-end";
    background?: Background;
} & Offset;
export type Offset = {
    position?: "relative" | "absolute";
    offsetTop?: string;
    offsetBottom?: string;
    offsetStart?: string;
    offsetEnd?: string;
};
export type Background = {
    type: "linearGradient";
    angle: string;
    startColor: string;
    endColor: string;
    centerColor?: string;
    centerPosition?: string;
};
export type FlexButton = {
    type: "button";
    action: Action;
    flex?: number;
    margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
    height?: "sm" | "md";
    style?: "link" | "primary" | "secondary";
    color?: string;
    gravity?: "top" | "bottom" | "center";
    adjustMode?: "shrink-to-fit";
} & Offset;
export type FlexFiller = {
    type: "filler";
    flex?: number;
};
export type FlexIcon = {
    type: "icon";
    url: string;
    margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
    size?:
    | string
    | "xxs"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "xxl"
    | "3xl"
    | "4xl"
    | "5xl";
    aspectRatio?: string;
} & Offset;
export type FlexImage = {
    type: "image";
    url: string;
    flex?: number;
    margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
    align?: "start" | "end" | "center";
    gravity?: "top" | "bottom" | "center";
    size?:
    | string
    | "xxs"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "xxl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full";
    aspectRatio?: string;
    aspectMode?: "cover" | "fit";
    backgroundColor?: string;
    action?: Action;
    animated?: Boolean;
} & Offset;
export type FlexSeparator = {
    type: "separator";
    margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
    color?: string;
};
export type FlexSpacer = {
    type: "spacer";
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
};
export type FlexText = {
    type: "text";
    text: string;
    contents?: FlexSpan[];
    adjustMode?: "shrink-to-fit";
    flex?: number;
    margin?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
    size?:
    | string
    | "xxs"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "xxl"
    | "3xl"
    | "4xl"
    | "5xl";
    align?: "start" | "end" | "center";
    gravity?: "top" | "bottom" | "center";
    wrap?: boolean;
    maxLines?: number;
    weight?: "regular" | "bold";
    color?: string;
    action?: Action;
    style?: string;
    decoration?: string;
} & Offset;
export type FlexSpan = {
    type: "span";
    text: string;
    color?: string;
    size?:
    | string
    | "xxs"
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "xxl"
    | "3xl"
    | "4xl"
    | "5xl";
    weight?: string;
    style?: string;
    decoration?: string;
};
export type TemplateContent =
    | TemplateButtons
    | TemplateConfirm
    | TemplateCarousel
    | TemplateImageCarousel;
export type TemplateButtons = {
    type: "buttons";
    thumbnailImageUrl?: string;
    imageAspectRatio?: "rectangle" | "square";
    imageSize?: "cover" | "contain";
    imageBackgroundColor?: string;
    title?: string;
    text: string;
    actions: Action[];
};
export type TemplateConfirm = {
    type: "confirm";
    text: string;
    actions: Action[];
};
export type TemplateCarousel = {
    type: "carousel";
    columns: TemplateColumn[];
    imageAspectRatio?: "rectangle" | "square";
    imageSize?: "cover" | "contain";
};
export type TemplateColumn = {
    thumbnailImageUrl?: string;
    imageBackgroundColor?: string;
    title?: string;
    text: string;
    defaultAction?: Action;
    actions: Action[];
};
export type TemplateImageCarousel = {
    type: "image_carousel";
    columns: TemplateImageColumn[];
};
export type TemplateImageColumn = {
    imageUrl: string;
    action: Action<{ label?: string }>;
};
export type QuickReply = {
    items: QuickReplyItem[];
};
export type QuickReplyItem = {
    type: "action";
    imageUrl?: string;
    action: Action;
};
export type Sender = {
    name?: string;
    iconUrl?: string;
};
export type Action<ExtraFields = { label: string }> = (
    | PostbackAction
    | MessageAction
    | URIAction
    | DatetimePickerAction
    | RichMenuSwitchAction
    | { type: "camera" }
    | { type: "cameraRoll" }
    | { type: "location" }
) &
    ExtraFields;
export type PostbackAction = {
    type: "postback";
    data: string;
    text?: string;
    displayText?: string;
};
export type MessageAction = {
    type: "message";
    text: string;
};
export type URIAction = {
    type: "uri";
    uri: string;
    altUri?: AltURI;
};
export type AltURI = {
    desktop: string;
};
export type DatetimePickerAction = {
    type: "datetimepicker";
    data: string;
    mode: "date" | "time" | "datetime";
    initial?: string;
    max?: string;
    min?: string;
};
export type Size = {
    width: number;
    height: number;
};
export type RichMenuSwitchAction = {
    type: "richmenuswitch";
    label?: string;
    richMenuAliasId: string;
    data: string;
};
export type RichMenu = {
    size: Size;
    selected: boolean;
    name: string;
    chatBarText: string;
    areas: Array<{ bounds: Area; action: Action<{ label?: string }> }>;
};
export type RichMenuResponse = { richMenuId: string } & RichMenu;
export type NumberOfMessagesSentResponse = InsightStatisticsResponse & {
    success?: number;
};
export type TargetLimitForAdditionalMessages = {
    type: "none" | "limited";
    value?: number;
};
export type NumberOfMessagesSentThisMonth = {
    totalUsage: number;
};
export const LINE_REQUEST_ID_HTTP_HEADER_NAME = "x-line-request-id";
export type MessageAPIResponseBase = {
    [LINE_REQUEST_ID_HTTP_HEADER_NAME]?: string;
};
export const LINE_SIGNATURE_HTTP_HEADER_NAME = "x-line-signature";
export type InsightStatisticsResponse = {
    status: "ready" | "unready" | "out_of_service";
};
export type NumberOfMessageDeliveries = InsightStatisticsResponse & {
    broadcast: number;
    targeting: number;
    autoResponse: number;
    welcomeResponse: number;
    chat: number;
    apiBroadcast: number;
    apiPush: number;
    apiMulticast: number;
    apiReply: number;
};
export type NumberOfFollowers = InsightStatisticsResponse & {
    followers: Number;
    targetedReaches: Number;
    blocks: Number;
};
export type NumberOfMessageDeliveriesResponse =
    | InsightStatisticsResponse
    | NumberOfMessageDeliveries;
export type NumberOfFollowersResponse =
    | InsightStatisticsResponse
    | NumberOfFollowers;
type PercentageAble = {
    percentage: number;
};
export type FriendDemographics = {
    available: boolean;
    genders?: Array<
        {
            gender: "unknown" | "male" | "female";
        } & PercentageAble
    >;
    ages?: Array<
        {
            age: string;
        } & PercentageAble
    >;
    areas?: Array<
        {
            area: string;
        } & PercentageAble
    >;
    appTypes?: Array<
        {
            appType: "ios" | "android" | "others";
        } & PercentageAble
    >;
    subscriptionPeriods?: Array<
        {
            subscriptionPeriod:
            | "over365days"
            | "within365days"
            | "within180days"
            | "within90days"
            | "within30days"
            | "within7days"
            | "unknown";
        } & PercentageAble
    >;
};
type UserInteractionStatisticsOfEachMessage = {
    seq: number;
    impression: number;
    mediaPlayed: number;
    mediaPlayed25Percent: number;
    mediaPlayed50Percent: number;
    mediaPlayed75Percent: number;
    mediaPlayed100Percent: number;
    uniqueMediaPlayed: number;
    uniqueMediaPlayed25Percent: number;
    uniqueMediaPlayed50Percent: number;
    uniqueMediaPlayed75Percent: number;
    uniqueMediaPlayed100Percent: number;
};
type UserInteractionStatisticsOfEachURL = {
    seq: number;
    url: number;
    click: number;
    uniqueClick: number;
    uniqueClickOfRequest: number;
};
export type UserInteractionStatistics = {
    overview: {
        requestId: string;
        timestamp: number;
        delivered: number;
        uniqueImpression: number;
        uniqueClick: number;
        uniqueMediaPlayed: number;
        uniqueMediaPlayed100Percent: number;
    };
    messages: UserInteractionStatisticsOfEachMessage[];
    clicks: UserInteractionStatisticsOfEachURL[];
};
type FilterOperatorObject<T> = {
    type: "operator";
} & (
        | {
            and: (T | FilterOperatorObject<T>)[];
        }
        | {
            or: (T | FilterOperatorObject<T>)[];
        }
        | {
            not: T | (T | FilterOperatorObject<T>)[];
        }
    );
type AudienceObject = {
    type: "audience";
    audienceGroupId: number;
};
type RedeliveryObject = {
    type: "redelivery";
    requestId: string;
};
export type ReceieptObject =
    | AudienceObject
    | RedeliveryObject
    | FilterOperatorObject<AudienceObject>
    | FilterOperatorObject<RedeliveryObject>;
type DemographicAge =
    | "age_15"
    | "age_20"
    | "age_25"
    | "age_30"
    | "age_35"
    | "age_40"
    | "age_45"
    | "age_50";
type DemographicSubscriptionPeriod =
    | "day_7"
    | "day_30"
    | "day_90"
    | "day_180"
    | "day_365";
type DemographicArea =
    | "jp_01"
    | "jp_02"
    | "jp_03"
    | "jp_04"
    | "jp_05"
    | "jp_06"
    | "jp_07"
    | "jp_08"
    | "jp_09"
    | "jp_10"
    | "jp_11"
    | "jp_12"
    | "jp_13"
    | "jp_14"
    | "jp_15"
    | "jp_16"
    | "jp_17"
    | "jp_18"
    | "jp_19"
    | "jp_20"
    | "jp_21"
    | "jp_22"
    | "jp_23"
    | "jp_24"
    | "jp_25"
    | "jp_26"
    | "jp_27"
    | "jp_28"
    | "jp_29"
    | "jp_30"
    | "jp_31"
    | "jp_32"
    | "jp_33"
    | "jp_34"
    | "jp_35"
    | "jp_36"
    | "jp_37"
    | "jp_38"
    | "jp_39"
    | "jp_40"
    | "jp_41"
    | "jp_42"
    | "jp_43"
    | "jp_44"
    | "jp_45"
    | "jp_46"
    | "jp_47"
    | "tw_01"
    | "tw_02"
    | "tw_03"
    | "tw_04"
    | "tw_05"
    | "tw_06"
    | "tw_07"
    | "tw_08"
    | "tw_09"
    | "tw_10"
    | "tw_11"
    | "tw_12"
    | "tw_13"
    | "tw_14"
    | "tw_15"
    | "tw_16"
    | "tw_17"
    | "tw_18"
    | "tw_19"
    | "tw_20"
    | "tw_21"
    | "tw_22"
    | "th_01"
    | "th_02"
    | "th_03"
    | "th_04"
    | "th_05"
    | "th_06"
    | "th_07"
    | "th_08"
    | "id_01"
    | "id_02"
    | "id_03"
    | "id_04"
    | "id_06"
    | "id_07"
    | "id_08"
    | "id_09"
    | "id_10"
    | "id_11"
    | "id_12"
    | "id_05";
type DemographicObject =
    | {
        type: "gender";
        oneOf: ("male" | "female")[];
    }
    | {
        type: "age";
        gte?: DemographicAge;
        lt?: DemographicAge;
    }
    | {
        type: "appType";
        oneOf: ("ios" | "android")[];
    }
    | {
        type: "area";
        oneOf: DemographicArea[];
    }
    | {
        type: "subscriptionPeriod";
        gte?: DemographicSubscriptionPeriod;
        lt?: DemographicSubscriptionPeriod;
    };
export type DemographicFilterObject =
    | DemographicObject
    | FilterOperatorObject<DemographicObject>;
export type NarrowcastProgressResponse = (
    | {
        phase: "waiting";
    }
    | ((
        | {
            phase: "sending" | "succeeded";
        }
        | {
            phase: "failed";
            failedDescription: string;
        }
    ) & {
        successCount: number;
        failureCount: number;
        targetCount: string;
        acceptedTime: string;
        completedTime: string;
    })
) & {
    errorCode?: 1 | 2;
};
type AudienceGroupJob = {
    audienceGroupJobId: number;
    audienceGroupId: number;
    description: string;
    type: "DIFF_ADD";
    audienceCount: number;
    created: number;
} & (
        | {
            jobStatus: "QUEUED" | "WORKING" | "FINISHED";
        }
        | {
            jobStatus: "FAILED";
            failedType: "INTERNAL_ERROR";
        }
    );
export type AudienceGroupStatus =
    | "IN_PROGRESS"
    | "READY"
    | "EXPIRED"
    | "FAILED";
export type AudienceGroupCreateRoute = "OA_MANAGER" | "MESSAGING_API";
type _AudienceGroup = {
    audienceGroupId: number;
    description: string;
    audienceCount: number;
    created: number;
    isIfaAudience: boolean;
    permission: "READ" | "READ_WRITE";
    createRoute: AudienceGroupCreateRoute;
} & (
        | {
            status: Exclude<AudienceGroupStatus, "FAILED">;
        }
        | {
            status: "FAILED";
            failedType: "AUDIENCE_GROUP_AUDIENCE_INSUFFICIENT" | "INTERNAL_ERROR";
        }
    ) &
    (
        | {
            type: "UPLOAD";
        }
        | {
            type: "CLICK";
            clickUrl: string;
        }
        | {
            type: "IMP";
            requestId: string;
        }
    );
export type AudienceGroup = _AudienceGroup & {
    jobs: AudienceGroupJob[];
};
export type AudienceGroups = _AudienceGroup[];
export type AudienceGroupAuthorityLevel = "PUBLIC" | "PRIVATE";
export type ChannelAccessToken = {
    access_token: string;
    expires_in: number;
    token_type: "Bearer";
    key_id?: string;
};
export type GroupSummaryResponse = {
    groupId: string;
    groupName: string;
    pictureUrl: string;
};
export type MembersCountResponse = {
    count: number;
};
export type GetRichMenuAliasResponse = {
    richMenuAliasId: string;
    richMenuId: string;
};
export type GetRichMenuAliasListResponse = {
    aliases: GetRichMenuAliasResponse[];
};
export type BotInfoResponse = {
    userId: string;
    basicId: string;
    premiumId?: string;
    displayName: string;
    pictureUrl?: string;
    chatMode: "chat" | "bot";
    markAsReadMode: "auto" | "manual";
};
export type WebhookEndpointInfoResponse = {
    endpoint: string;
    active: boolean;
};
export type TestWebhookEndpointResponse = {
    success: boolean;
    timestamp: string;
    statusCode: number;
    reason: string;
    detail: string;
};