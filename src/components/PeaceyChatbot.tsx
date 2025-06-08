// src/components/PeaceyChatbot.tsx
import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useEternalpEASEAi } from "../context/EternalpEASEAiContext";

const funeralPackages = [
  { name: "Package A", price: "₱30,000" },
  { name: "Package B", price: "₱40,000" },
  { name: "Package C", price: "₱50,000" },
  { name: "Package D", price: "₱60,000" },
  { name: "Package E", price: "₱70,000" },
  { name: "Package F", price: "₱80,000" },
  { name: "Package G", price: "₱90,000" },
  { name: "Package H", price: "₱100,000" },
  { name: "Package I", price: "₱120,000" },
  { name: "Package J", price: "₱250,000" },
];

const packageThemes = [
  "Natural – nature-inspired, with flowers, greenery, and peaceful landscapes.",
  "Classic – timeless style with formal arrangements and neutral palettes.",
  "Modern – minimalist designs using clean lines and soft colors.",
  "Traditional – classic Filipino motifs, candles, and heritage-inspired decor.",
];

const funeralQAPairs: { question: RegExp; answer: string | ((match: RegExpMatchArray) => string) }[] = [
  {
    question: /how many (funeral )?packages (do you have|are there)|number of packages|funeral packages/i,
    answer:
      "We offer 10 packages:\n" +
      funeralPackages.map(pkg => `- ${pkg.name} (${pkg.price})`).join("\n") +
      "\nYou can choose any package and customize it with your preferred theme.",
  },
  {
    question: /what (are|is|do you offer) (the )?packages|list.*packages|can you list.*packages/i,
    answer:
      "Here are our 10 standard packages:\n" +
      funeralPackages.map(pkg => `- ${pkg.name} (${pkg.price})`).join("\n") +
      "\nEvery package includes core funeral services and can be further customized.",
  },
  {
    question: /how much.*(package|cost|price)|price.*package|package.*price|cost.*funeral/i,
    answer:
      "Our packages range from ₱30,000 (Package A) to ₱250,000 (Package J). Most families choose packages in the ₱50,000 to ₱100,000 range. Let me know if you want the price for a specific package.",
  },
  {
    question: /(price|cost) of (package [a-j])/i,
    answer: (match: RegExpMatchArray) => {
      const pkg = funeralPackages.find(
        (p) => p.name.toLowerCase() === match[2].toLowerCase()
      );
      if (pkg) {
        return `${pkg.name} costs ${pkg.price}. You can customize this with any of our 4 available themes. Would you like to know what's included?`;
      }
      return "Sorry, I couldn't find that package. Please ask about Package A to J.";
    },
  },
  {
    question: /cheapest|lowest price|most affordable|budget|minimum cost/i,
    answer: "Our most affordable package is Package A at ₱30,000, which includes all essential funeral services. Would you like to know what's included in this package?",
  },
  {
    question: /most expensive|highest price|premium|luxury|top package/i,
    answer: "Our premium package is Package J at ₱250,000, which includes our most comprehensive services and premium amenities. Would you like details about this package?",
  },
  {
    question: /payment.*plan|installment|pay.*monthly|financing/i,
    answer: "Yes, we offer flexible payment plans and installment options to make our services more accessible. Contact our support team to discuss payment arrangements that work for your family.",
  },
  {
    question: /what.*included.*package|package.*include|what.*get.*package/i,
    answer: "Each package includes: casket/urn, embalming, viewing arrangements, transportation, funeral service coordination, and documentation assistance. Higher packages include additional amenities and premium options.",
  },

  // THEMES & CUSTOMIZATION
  {
    question: /what (are )?(the )?(themes|styles|motifs)|theme.*package|can i customize.*theme/i,
    answer:
      "You can choose from 4 beautiful themes for any package:\n" +
      packageThemes.map((t, i) => `${i + 1}. ${t}`).join("\n") +
      "\nYour chosen theme will be reflected in the decor and generated images.",
  },
  {
    question: /customize|personalize|modify|change.*package/i,
    answer: "Yes! All packages can be customized with your preferred theme, additional flowers, music, special arrangements, or personal touches. We'll work with you to honor your loved one's memory.",
  },
  {
    question: /flowers|arrangements|decorations|decor/i,
    answer: "We provide beautiful floral arrangements matching your chosen theme. You can also request specific flowers, colors, or custom arrangements for an additional fee.",
  },

  // SERVICE TYPES
  {
    question: /what (types|kind|kinds|forms) of (funeral|service|ceremony)/i,
    answer: "We offer traditional funerals, cremation services, memorials, celebration of life ceremonies, wake services. Each can be paired with any package and theme.",
  },
  {
    question: /traditional.*funeral|catholic.*funeral|christian.*funeral/i,
    answer: "We provide traditional religious funeral services following Catholic, Protestant, and other Christian traditions. This includes wake services, funeral mass coordination, and burial arrangements.",
  },
  {
    question: /celebration.*life|memorial.*service|remembrance.*service/i,
    answer: "Our celebration of life services focus on honoring your loved one's life and legacy. These can be more personalized and less formal than traditional funerals, featuring photos, videos, and shared memories.",
  },
  {
    question: /wake.*service|viewing|visitation/i,
    answer: "We provide wake services with comfortable viewing areas, seating for family and friends, and all necessary arrangements. Duration can be customized based on your family's needs.",
  },

  // CREMATION & BURIAL
  {
    question: /cremat|burial|urn|ashes/i,
    answer: "We provide both cremation and burial options. Cremation packages start at ₱40,000, and burial packages start at ₱50,000. Any package can be customized for either option.",
  },
  {
    question: /cremation.*process|how.*cremation|cremation.*work/i,
    answer: "Our cremation process is respectful and dignified. We handle all documentation, provide temporary and permanent urns, and can arrange for ash scattering or interment according to your wishes.",
  },
  {
    question: /burial.*process|how.*burial|cemetery|grave/i,
    answer: "We coordinate burial services including casket selection, cemetery arrangements, grave preparation, and graveside services. We work with various cemeteries and can help you choose the right location.",
  },
  {
    question: /casket|coffin|urn.*options/i,
    answer: "We offer a wide selection of caskets and urns in different materials, styles, and price ranges. From simple wooden caskets to premium metal options, and from basic urns to decorative memorial urns.",
  },

  // DOCUMENTATION & LEGAL
  {
    question: /death certificate|documents|paperwork|legal/i,
    answer: "We assist with all necessary documentation including death certificates, burial permits, insurance claims, and government requirements. Our team handles the paperwork so you can focus on your family.",
  },
  {
    question: /insurance|claim|benefits/i,
    answer: "We help process insurance claims and government benefits including SSS, GSIS, and other death benefits. Our team will guide you through the application process.",
  },
  {
    question: /permit|requirements|government|city hall/i,
    answer: "We handle all required permits and government requirements including burial permits, transport permits, and local government documentation. Everything is taken care of for you.",
  },

  // TRANSPORTATION & LOGISTICS
  {
    question: /transport|vehicle|hearse|pickup/i,
    answer: "We provide professional transportation services including hearse, family cars, and pickup services. Transportation is included in all packages, with premium vehicles available in higher packages.",
  },
  {
    question: /location|venue|where.*service|funeral home/i,
    answer: "Services can be held at our funeral homes, churches, family residences, or other venues of your choice. We have multiple locations and can coordinate services anywhere in Metro Manila.",
  },
  {
    question: /pickup.*body|transfer.*deceased|bring.*home/i,
    answer: "We provide pickup services from hospitals, homes, or other locations. Our professional staff handles the transfer with dignity and respect, following all health and safety protocols.",
  },

  // TIMELINE & SCHEDULING
  {
    question: /how long|duration|days.*funeral|schedule/i,
    answer: "Funeral services typically last 3-7 days depending on your preferences. This includes wake/viewing (1-3 days), funeral service (1 day), and burial/cremation. We can adjust the timeline to meet your family's needs.",
  },
  {
    question: /when.*available|schedule.*funeral|book.*date/i,
    answer: "We're available for funeral arrangements. Most services can be scheduled within 24-48 hours. We'll work with your preferred dates and coordinate with churches, cemeteries, and other venues.",
  },
  {
    question: /emergency|urgent|immediate|rush/i,
    answer: "We provide emergency services for immediate needs. Call our hotline anytime, and we'll respond quickly to assist with urgent arrangements and provide immediate support.",
  },

  // PRE-PLANNING
  {
    question: /pre-?plan.*funeral|plan.*in advance|advance (planning|arrangement)/i,
    answer: "Yes, we offer pre-planning so you can make arrangements in advance, ensuring your wishes are honored and easing the burden on your family. Pre-planning also locks in today's prices.",
  },
  {
    question: /pre.*need|plan.*ahead|future.*planning/i,
    answer: "Pre-need planning allows you to make all funeral arrangements in advance and pay over time. This ensures your family won't have to make difficult decisions during their time of grief while also providing financial protection.",
  },

  // GRIEF SUPPORT & COUNSELING
  {
    question: /grief support|support.*grieving|help.*grief|bereavement/i,
    answer: "We offer grief support, including resources and connections to professional counselors or support groups. We understand that healing takes time, and we're here to support you beyond the funeral service.",
  },
  {
    question: /counseling|therapy|emotional support|coping/i,
    answer: "We can connect you with professional grief counselors and support groups. Many families find comfort in speaking with others who have experienced similar losses.",
  },

  // DIGITAL & MEMORIAL SERVICES
  {
    question: /memorial|tribute|remember|digital memorial/i,
    answer: "You can create digital memorials and tributes in the EternalpEASE app, choosing any of our themes for a personalized experience. We also offer online streaming for distant family and friends.",
  },
  {
    question: /live stream|online.*service|virtual.*funeral|video/i,
    answer: "We offer live streaming services so family and friends who cannot attend in person can participate in the service online. This includes setup of cameras, audio, and streaming platforms.",
  },
  {
    question: /photos|video.*tribute|slideshow|memory.*board/i,
    answer: "We can create photo slideshows, video tributes, and memory boards celebrating your loved one's life. These can be displayed during the service and shared with family and friends.",
  },

  // SPECIAL SERVICES
  {
    question: /military.*funeral|veteran|honor guard/i,
    answer: "We provide military funeral honors for veterans including flag presentation, honor guard, and coordination with military representatives. We ensure your veteran receives the respect they deserve.",
  },
  {
    question: /child.*funeral|infant|baby|pediatric/i,
    answer: "We provide compassionate care for infant and child services with special packages designed for families during this difficult time. Our staff is specially trained to provide gentle, sensitive support.",
  },
  {
    question: /eco.*friendly|green.*burial|natural.*burial|environmental/i,
    answer: "We offer eco-friendly options including biodegradable caskets, natural burial sites, and environmentally conscious practices. These options honor both your loved one and the environment.",
  },

  // CONTACT & SUPPORT
  {
    question: /contact.*support|how.*contact|reach.*support|customer service/i,
    answer: "You can contact our support team via the app or by emailing support@eternalpease.com.",
  },
  {
    question: /sino.*matulog|sino.*maaga|matulog.*maaga|customer service/i,
    answer: "Si Angel Lauren Sanchez",
  },
  {
    question: /tips.*para|makatulog.*maaga|tips.*para|customer service/i,
    answer: "MAG DROP KA NA",
  },
  {
    question: /emergency.*contact|hotline|urgent.*help/i,
    answer: "Our emergency hotline is 0917-PEACEY1 (0917-732-2391. We're available for urgent needs and emergency funeral arrangements.",
  },
  {
    question: /office.*hours|when.*open|business hours/i,
    answer: "Our funeral homes are open for your convenience. Our administrative offices are open Monday-Saturday 8AM-6PM, and our emergency services are available when needed.",
  },

  // ARRANGEMENTS & BOOKING
  {
    question: /how (do|can) i arrange.*funeral|arrange.*funeral|book.*funeral/i,
    answer: "To arrange a funeral, simply choose your preferred package and theme in the EternalpEASE app or contact our support team. We'll guide you every step of the way and handle all the details.",
  },
  {
    question: /what.*do.*first|where.*start|begin.*process/i,
    answer: "Start by contacting us immediately. We'll guide you through: 1) Immediate needs (body pickup/transfer), 2) Package selection, 3) Documentation assistance, 4) Service planning, and 5) Final arrangements.",
  },
  {
    question: /checklist|what.*need|requirements.*family/i,
    answer: "We'll help you gather: valid IDs, medical certificate of death, marriage certificate (if applicable), birth certificate, and any insurance documents. Don't worry - we'll guide you through everything you need.",
  },

  // FACILITIES & AMENITIES
  {
    question: /facilities|amenities|chapel|rooms/i,
    answer: "Our facilities include climate-controlled chapels, comfortable family rooms, parking areas, catering facilities, and audio-visual equipment. Each location is designed to provide comfort during difficult times.",
  },
  {
    question: /parking|accessibility|wheelchair|facilities/i,
    answer: "All our locations offer ample parking and are wheelchair accessible. We have ramps, accessible restrooms, and reserved parking for elderly and disabled guests.",
  },
  {
    question: /catering|food|refreshments|meals/i,
    answer: "We can arrange catering services for family and guests, from simple refreshments to full meals. We work with trusted caterers who understand the needs of funeral gatherings.",
  },

  // RELIGIOUS & CULTURAL
  {
    question: /muslim.*funeral|islamic.*service|halal/i,
    answer: "We provide Islamic funeral services following Muslim traditions including proper preparation, quick burial arrangements, and coordination with Islamic centers and imams.",
  },
  {
    question: /buddhist.*funeral|buddhist.*service/i,
    answer: "We offer Buddhist funeral services with proper ceremonies, incense arrangements, and coordination with Buddhist temples and monks according to Buddhist traditions.",
  },
  {
    question: /chinese.*funeral|chinese.*tradition|feng shui/i,
    answer: "We provide traditional Chinese funeral services including proper arrangements according to Chinese customs, coordination with Taoist or Buddhist elements, and feng shui considerations.",
  },

  // GENERAL INQUIRIES
  {
    question: /funeral/i,
    answer: "EternalpEASE helps make funeral and memorial arrangements gentle and respectful. Ask about our packages, prices, themes, or any step of the process. I'm here to help with any questions you have.",
  },
  {
    question: /hello|hi|hey|good morning|good afternoon|good evening/i,
    answer: "Hello! 👋 I'm Peacey, your compassionate funeral service assistant. How can I help you today? You can ask me about packages, services, or any funeral-related questions.",
  },
  {
    question: /help|support|assist/i,
    answer: "I'm here to help! You can ask me about:\n• Funeral packages and pricing\n• Service types and themes\n• Documentation assistance\n• Scheduling and arrangements\n• Grief support resources\n• Any other funeral-related questions",
  },
  {
    question: /thank you|thanks/i,
    answer: "You're very welcome. I'm here whenever you need assistance or have questions. Take care, and please don't hesitate to reach out anytime. 🙏",
  },
];

const demoAiResponse = (userMessage: string) => {
  for (const pair of funeralQAPairs) {
    const match = userMessage.match(pair.question);
    if (match) {
      if (typeof pair.answer === "function") {
        return pair.answer(match);
      }
      return pair.answer;
    }
  }
  
  // Default responses for unmatched queries
  if (/forgot.*password/i.test(userMessage)) {
    return "If you forgot your password, tap 'Forgot Password?' on the login screen to reset it.";
  }
  
  return "I'm here to help with any funeral service questions. You can ask me about packages, pricing, services, arrangements, documentation, or anything else related to funeral planning. What would you like to know?";
};

const PeaceyChatbot: React.FC<{ showFloating?: boolean }> = ({ showFloating = false }) => {
  const { theme } = useTheme();
  const { aiName, greeting } = useEternalpEASEAi();
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([
    { id: "0", sender: "ai", content: greeting },
  ]);
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMessage = {
      id: `${messages.length}`,
      sender: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    setTimeout(() => {
      const aiMessage = {
        id: `${messages.length + 1}`,
        sender: "ai",
        content: demoAiResponse(userMessage.content),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }, 650);
  };

  return (
    <>
      {showFloating && !showChat && (
        <TouchableOpacity
          onPress={() => setShowChat(true)}
          activeOpacity={0.85}
          className={`
            absolute bottom-12 right-6 z-50 shadow-lg items-center justify-center px-4
            rounded-t-3xl rounded-b-xl
            ${theme === "dark" ? "bg-[#263043] border-blue-900" : "bg-[#E5E7EB] border-gray-200"}
            border-2
          `}
          style={{
            width: 70, height: 90,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 8,
          }}
        >
          <MaterialCommunityIcons
            name="grave-stone"
            size={38}
            color={theme === "dark" ? "#CBD5E1" : "#64748b"}
            style={{ marginBottom: 2 }}
          />
          <Text className={`text-xs font-semibold ${theme === "dark" ? "text-blue-200" : "text-[#415D7C]"}`}>
            Peacey
          </Text>
        </TouchableOpacity>
      )}
      <Modal
        animationType="slide"
        transparent
        visible={showChat}
        onRequestClose={() => setShowChat(false)}
      >
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View className="flex-1 bg-black/40 justify-end">
            <View className={`rounded-t-3xl overflow-hidden shadow-2xl ${theme === "dark" ? "bg-[#232b37]" : "bg-[#F8FAFC]"}`}
              style={{ minHeight: "75%", maxHeight: "90%" }}
            >
              {/* Close Button */}
              <TouchableOpacity
                className="absolute top-2 right-4 z-10"
                onPress={() => setShowChat(false)}
                style={{ padding: 8 }}
              >
                <Ionicons name="close" size={32} color={theme === "dark" ? "#fff" : "#415D7C"} />
              </TouchableOpacity>
              {/* Header */}
              <View className="flex-row items-center justify-center mt-4 mb-2">
                <MaterialCommunityIcons name="grave-stone" size={28} color="#64748b" />
                <Text className={`ml-2 text-xl font-bold ${theme === "dark" ? "text-blue-200" : "text-[#415D7C]"}`}>
                  Peacey AI
                </Text>
              </View>
              <View className={theme === "dark" ? "border-b border-blue-900 mb-2" : "border-b border-blue-200 mb-2"} />
              {/* Messages */}
              <View className="flex-1 px-3">
                <FlatList
                  ref={flatListRef}
                  data={messages}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View className={`${item.sender === "user" ? "self-end" : "self-start"} my-1 max-w-[80%]`}>
                      <View className={`
                        rounded-2xl py-2.5 px-4 mb-0.5
                        ${item.sender === "user"
                          ? "bg-[#415D7C] dark:bg-[#3B82F6]"
                          : "bg-[#E3E9F6] dark:bg-[#263043]"}
                      `}>
                        <Text className={`
                          text-base leading-5
                          ${item.sender === "user"
                            ? "text-white"
                            : "text-[#222F3E] dark:text-white"}
                        `}>
                          {item.content}
                        </Text>
                      </View>
                      {item.sender === "ai" && (
                        <View className="flex-row items-center mb-0.5">
                          <MaterialCommunityIcons name="grave-stone" color="#64748b" size={18} style={{ marginRight: 2 }} />
                          <Text className="text-xs font-medium text-[#64748b]">{aiName}</Text>
                        </View>
                      )}
                    </View>
                  )}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 10 }}
                  onContentSizeChange={() =>
                    flatListRef.current?.scrollToEnd({ animated: true })
                  }
                />
              </View>
              {/* Chat Input */}
              <View className="px-3 pb-3 pt-2">
                <View
                  className={`
                    flex-row items-center
                    rounded-full px-2
                    ${theme === "dark" ? "bg-[#18181b]" : "bg-white"}
                    shadow
                  `}
                  style={{
                    shadowColor: "#000",
                    shadowOpacity: 0.04,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                >
                  <TextInput
                    className={`
                      flex-1 text-base
                      ${theme === "dark" ? "text-white" : "text-[#222F3E]"}
                    `}
                    placeholder={`Ask ${aiName}...`}
                    placeholderTextColor={theme === "dark" ? "#64748b" : "#BAC8D3"}
                    value={input}
                    onChangeText={setInput}
                    onSubmitEditing={sendMessage}
                    returnKeyType="send"
                    editable={true}
                    secureTextEntry={false}
                    multiline={true}
                    style={{
                      minHeight: 48,
                      maxHeight: 100,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      textAlignVertical: 'top',
                      includeFontPadding: false
                    }}
                  />
                  <TouchableOpacity
                    onPress={sendMessage}
                    className="p-2"
                    disabled={!input.trim()}
                  >
                    <Ionicons
                      name="send"
                      size={24}
                      color={input.trim() ? "#415D7C" : "#BAC8D3"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

export default PeaceyChatbot;