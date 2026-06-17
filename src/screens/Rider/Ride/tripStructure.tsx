import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import useTheme from "../../../hooks/useThemes";
import { commonStyles } from "../../../styles/commonStyles";
import {
  ArrowRight,
  ArrowRightLeft,
  CalendarIcon,
  Check,
  Clock,
  User,
  UserPlus,
} from "lucide-react-native";
import GoogleInput from "../../../components/inputs/googleInput";
import { format } from "date-fns";
import CalendarComponent from "../../../components/inputs/calender";
import TimePicker from "../../../components/inputs/timePicker";
import MultilineInput from "../../../components/inputs/multilineInput";


function TripStructure({
  tripType,
  setTripType,
  pickUpForm,
  togglePicker,
  updatePickUPFormFields,
  onPickUpPlaceSelected,
  loadingPickup,
  setloadingPickup,
  destinationForm,
  updateDestinationFormFields,
  onDestinationPlaceSelected,
  loadingDestination,
  setloadingDestination,
  date,
  showPicker,
  setShowPicker,
  setDate,
  minDateString,
  maxDateString,
  showTimePicker,
  setShowTimePicker,
  time,
  setTime,
  parseLocalDate,
  formatLocalDate,
  passenger,
  setPassenger,
  passengerFirstName,
  setPassengerFirstName,
  passengerLastName,
  setPassengerLastName,
  passengerPhone,
  setPassengerPhone,
  assistance,
  setassistance,
  additionalNotes,
  setadditionalNotes,
}: any) {
  const { colors } = useTheme();
  const commonStyling = commonStyles(colors);
  const isAndroid = Platform.OS === "android";

  const selectedDateValue =
    typeof parseLocalDate === "function" ? parseLocalDate(date) : new Date(date);
  const minDateValue = minDateString
    ? typeof parseLocalDate === "function"
      ? parseLocalDate(minDateString)
      : new Date(minDateString)
    : undefined;
  const maxDateValue = maxDateString
    ? typeof parseLocalDate === "function"
      ? parseLocalDate(maxDateString)
      : new Date(maxDateString)
    : undefined;

  const getTimePickerValue = () => {
    const [hours, minutes] = time.split(":").map(Number);
    const value = new Date(selectedDateValue);

    value.setHours(hours || 0, minutes || 0, 0, 0);

    return value;
  };

  const getMinimumTimeForDate = () => {
    const todayString =
      typeof formatLocalDate === "function"
        ? formatLocalDate(new Date())
        : new Date().toISOString().split("T")[0];

    if (date !== todayString) return undefined;

    const minimumTime = new Date();
    minimumTime.setMinutes(minimumTime.getMinutes() + 20);

    return minimumTime;
  };

  const handleAndroidDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    setShowPicker(false);

    if (event.type === "dismissed" || !selectedDate) return;

    setDate(
      typeof formatLocalDate === "function"
        ? formatLocalDate(selectedDate)
        : selectedDate.toISOString().split("T")[0],
    );
  };

  const handleAndroidTimeChange = (
    event: DateTimePickerEvent,
    selectedTime?: Date,
  ) => {
    setShowTimePicker(false);

    if (event.type === "dismissed" || !selectedTime) return;

    const minimumTime = getMinimumTimeForDate();
    const validTime =
      minimumTime && selectedTime < minimumTime ? minimumTime : selectedTime;
    const hours = String(validTime.getHours()).padStart(2, "0");
    const minutes = String(validTime.getMinutes()).padStart(2, "0");

    setTime(`${hours}:${minutes}`);
  };

  return (
    <View>
      <Text
        style={[
          commonStyling.title,
          {
            fontSize: 18,
            fontFamily: "Bold",
          },
        ]}
      >
        Trip Structure
      </Text>
      <Text
        style={[
          styles.sectionSubtitle,
          commonStyling.subtitle,
          {
            fontSize: 14,
          },
        ]}
      >
        How do you want to travel?
      </Text>
      <TouchableOpacity
        style={[
          styles.choiceCard,
          {
            borderColor:
              tripType === "One Way"
                ? colors.primaryColor
                : colors.lightPrimaryBlueBorder,
          },
        ]}
        onPress={() => setTripType("One Way")}
      >
        <View
          style={[
            styles.iconBox,
            tripType === "One Way" && styles.activeIconBox,
          ]}
        >
          <ArrowRight
            color={tripType === "One Way" ? "#FFF" : "#64748B"}
            size={20}
          />
        </View>
        <View style={styles.choiceTextContainer}>
          <Text
            style={[
              commonStyling.title,
              {
                fontSize: 16,
                fontFamily: "Bold",
              },
            ]}
          >
            One Way
          </Text>
          <Text
            style={[
              styles.choiceDesc,
              commonStyling.subtitle,
              {
                fontSize: 14,
                fontFamily: "Medium",
              },
            ]}
          >
            Single trip to your destination
          </Text>
          <View style={styles.routePill}>
            <Text
              style={{
                color: colors.primaryColor,
                fontSize: 12,
                fontFamily: "Medium",
              }}
            >
              Home → Hospital
            </Text>
          </View>
        </View>
        {tripType === "One Way" && (
          <View style={styles.checkCircle}>
            <Check color="#FFF" size={14} />
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.choiceCard,
          {
            borderColor:
              tripType === "Round Trip"
                ? colors.primaryColor
                : colors.lightPrimaryBlueBorder,
          },
        ]}
        onPress={() => setTripType("Round Trip")}
      >
        <View
          style={[
            styles.iconBox,
            tripType === "Round Trip" && styles.activeIconBox,
          ]}
        >
          <ArrowRightLeft
            color={tripType === "Round Trip" ? "#FFF" : "#64748B"}
            size={20}
          />
        </View>
        <View style={styles.choiceTextContainer}>
          <Text
            style={[
              commonStyling.title,
              {
                fontSize: 16,
                fontFamily: "Bold",
              },
            ]}
          >
            Round Trip
          </Text>
          <Text
            style={[
              styles.choiceDesc,
              commonStyling.subtitle,
              {
                fontSize: 14,
                fontFamily: "Medium",
              },
            ]}
          >
            Ride to and from your destination
          </Text>

          <View style={styles.routePill}>
            <Text
              style={{
                color: colors.primaryColor,
                fontSize: 12,
                fontFamily: "Medium",
              }}
            >
              Home → Hospital → Home
            </Text>
          </View>
        </View>
        {tripType === "Round Trip" && (
          <View style={styles.checkCircle}>
            <Check color="#FFF" size={14} />
          </View>
        )}
      </TouchableOpacity>

      {/* Location Section */}
      <Text
        style={[
          commonStyling.title,
          {
            fontFamily: "Bold",
            fontSize: 18,
            marginTop: 16,
          },
        ]}
      >
        Where are you going?
      </Text>
      <Text
        style={[
          styles.subLabel,
          commonStyling.subtitle,
          {
            fontSize: 14,
          },
        ]}
      >
        Enter pickup and destination
      </Text>

      <View style={styles.inputGroup}>
        <Text
          style={[
            styles.inputLabel,
            commonStyling.subtitle,
            {
              fontSize: 12,
              fontFamily: "Medium",
            },
          ]}
        >
          Pickup Location
        </Text>

        <GoogleInput
          placeholder={`2847 Maple Avenue`}
          borderColor={colors.krGreen}
          inputValue={pickUpForm.address}
          setinputValue={(t: string) => updatePickUPFormFields({ address: t })}
          dropdown={true}
          onPlaceSelected={onPickUpPlaceSelected}
          loading={loadingPickup}
          setLoading={setloadingPickup}
        />

        <Text
          style={[
            styles.inputLabel,
            commonStyling.subtitle,
            {
              fontSize: 12,
              fontFamily: "Medium",
              marginTop: 16,
            },
          ]}
        >
          Destination
        </Text>
        <GoogleInput
          placeholder={`4567 Maple Avenue`}
          borderColor={colors.krGreen}
          inputValue={destinationForm.address}
          setinputValue={(t: string) =>
            updateDestinationFormFields({ address: t })
          }
          dropdown={true}
          onPlaceSelected={onDestinationPlaceSelected}
          loading={loadingDestination}
          setLoading={setloadingDestination}
        />
      </View>

      {/* Date & Time Section */}
      <Text
        style={[
          commonStyling.title,
          {
            fontFamily: "Bold",
            fontSize: 18,
            marginBottom: 16,
          },
        ]}
      >
        Date & Time
      </Text>
      <View style={styles.dateTimeRow}>
        <View
          style={{
            width: "43%",
          }}
        >
          <Text
            style={[
              styles.inputLabel,
              commonStyling.subtitle,
              {
                fontSize: 12,
                fontFamily: "Medium",
              },
            ]}
          >
            Date
          </Text>

          <TouchableOpacity
            onPress={togglePicker}
            activeOpacity={0.7}
            style={[
              styles.dateTimeInput,
              {
                borderWidth: 1,
                borderColor: colors.lightPrimaryBlueBorder,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 12,
                borderRadius: 10,
              },
            ]}
          >
            <Text style={[commonStyling.title, { fontSize: 15 }]}>
              {format(selectedDateValue, "dd/MM/yyyy")}
            </Text>
            <CalendarIcon size={18} color="#64748B" />
          </TouchableOpacity>

          {isAndroid ? (
            showPicker && (
              <DateTimePicker
                value={selectedDateValue}
                mode="date"
                display="default"
                minimumDate={minDateValue}
                maximumDate={maxDateValue}
                onChange={handleAndroidDateChange}
              />
            )
          ) : (
            <CalendarComponent
              visible={showPicker}
              date={date}
              setDate={setDate}
              setShowCalendar={setShowPicker}
              minDate={minDateString}
              maxDate={maxDateString}
              onPress={() => {}}
            />
          )}
        </View>

        <View
          style={{
            width: "40%",
          }}
        >
          <Text
            style={[
              styles.inputLabel,
              commonStyling.subtitle,
              {
                fontSize: 12,
                fontFamily: "Medium",
              },
            ]}
          >
            Time
          </Text>
          <TouchableOpacity
            onPress={() => setShowTimePicker(!showTimePicker)}
            activeOpacity={0.7}
            style={[
              styles.dateTimeInput,
              {
                borderWidth: 1,
                borderColor: colors.lightPrimaryBlueBorder,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 12,
                borderRadius: 10,
              },
            ]}
          >
            <Text style={[commonStyling.title, { fontSize: 15 }]}>{time}</Text>
            <Clock size={18} color="#64748B" />
          </TouchableOpacity>

          {/* Time Picker Logic */}
        </View>
      </View>

      {showTimePicker && isAndroid && (
        <DateTimePicker
          value={getTimePickerValue()}
          mode="time"
          display="default"
          minimumDate={getMinimumTimeForDate()}
          onChange={handleAndroidTimeChange}
        />
      )}

      {showTimePicker && !isAndroid && (
        <View
          style={{
            marginTop: 16,
          }}
        >
          <TimePicker
            initialHour={parseInt(time.split(":")[0])}
            initialMinute={parseInt(time.split(":")[1])}
            selectedDate={date}
            minMinutesFromNow={20}
            onChange={(selectedTime) => {
              setTime(selectedTime);
            }}
          />
        </View>
      )}

      {/* Passenger Section */}
      <Text
        style={[
          commonStyling.title,
          {
            fontFamily: "Bold",
            fontSize: 18,
            marginTop: 32,
          },
        ]}
      >
        Who needs this ride?
      </Text>
      <Text
        style={[
          styles.subLabel,
          commonStyling.subtitle,
          {
            fontSize: 14,
          },
        ]}
      >
        Select or add a passenger
      </Text>

      <TouchableOpacity
        style={[
          styles.choiceCard,
          {
            borderColor:
              passenger === "Myself"
                ? colors.primaryColor
                : colors.lightPrimaryBlueBorder,
          },
        ]}
        onPress={() => {
          setPassenger("Myself");
          setPassengerPhone("");
        }}
      >
        <View
          style={[
            styles.iconBox,
            passenger === "Myself" && styles.activeIconBox,
          ]}
        >
          <User color={passenger === "Myself" ? "#FFF" : "#64748B"} size={20} />
        </View>
        <View style={styles.choiceTextContainer}>
          <Text
            style={[
              commonStyling.title,
              {
                fontSize: 16,
                fontFamily: "Bold",
              },
            ]}
          >
            Myself
          </Text>
          <Text
            style={[
              styles.choiceDesc,
              commonStyling.subtitle,
              {
                fontSize: 14,
                fontFamily: "Medium",
              },
            ]}
          >
            From my account
          </Text>
        </View>
        {passenger === "Myself" && <Check color="#2563EB" size={20} />}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.choiceCard,
          {
            borderColor:
              passenger === "Someone Else"
                ? colors.primaryColor
                : colors.lightPrimaryBlueBorder,
          },
        ]}
        onPress={() => {
          setPassenger("Someone Else");
          setPassengerPhone("");
        }}
      >
        <View
          style={[
            styles.iconBox,
            passenger === "Someone Else" && styles.activeIconBox,
          ]}
        >
          <UserPlus
            color={passenger === "Someone Else" ? "#FFF" : "#64748B"}
            size={20}
          />
        </View>
        <View style={styles.choiceTextContainer}>
          <Text
            style={[
              commonStyling.title,
              {
                fontSize: 16,
                fontFamily: "Bold",
              },
            ]}
          >
            Someone Else
          </Text>
          <Text
            style={[
              styles.choiceDesc,
              commonStyling.subtitle,
              {
                fontSize: 14,
                fontFamily: "Medium",
              },
            ]}
          >
            Non app user
          </Text>
        </View>
        {passenger === "Someone Else" && <Check color="#2563EB" size={20} />}
      </TouchableOpacity>

      <View style={styles.passengerFields}>
        {passenger === "Someone Else" && (
          <View style={styles.nameRow}>
            <View style={styles.nameField}>
              <Text
                style={[
                  styles.inputLabel,
                  commonStyling.subtitle,
                  {
                    fontSize: 12,
                    fontFamily: "Medium",
                  },
                ]}
              >
                First Name
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    borderColor: colors.lightPrimaryBlueBorder,
                    color: colors.titleText,
                  },
                ]}
                placeholder="First name"
                placeholderTextColor="#94A3B8"
                value={passengerFirstName}
                onChangeText={setPassengerFirstName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
            <View style={styles.nameField}>
              <Text
                style={[
                  styles.inputLabel,
                  commonStyling.subtitle,
                  {
                    fontSize: 12,
                    fontFamily: "Medium",
                  },
                ]}
              >
                Last Name
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    borderColor: colors.lightPrimaryBlueBorder,
                    color: colors.titleText,
                  },
                ]}
                placeholder="Last name"
                placeholderTextColor="#94A3B8"
                value={passengerLastName}
                onChangeText={setPassengerLastName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          </View>
        )}

        <Text
          style={[
            styles.inputLabel,
            commonStyling.subtitle,
            {
              fontSize: 12,
              fontFamily: "Medium",
            },
          ]}
        >
          Phone Number
        </Text>
        <TextInput
          style={[
            styles.textInput,
            {
              borderColor: colors.lightPrimaryBlueBorder,
              color: colors.titleText,
            },
          ]}
          placeholder="Phone number"
          placeholderTextColor="#94A3B8"
          value={passengerPhone}
          onChangeText={setPassengerPhone}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
        />
      </View>
  
      <Text
        style={[
          commonStyling.title,
          {
            fontFamily: "Bold",
            fontSize: 18,
            marginTop: 20,
          },
        ]}
      >
        Assistance Level
      </Text>
      <Text
        style={[
          styles.subLabel,
          commonStyling.subtitle,
          {
            fontSize: 14,
          },
        ]}
      >
        How much help is needed?
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          style={[
            styles.choiceCard,
            {
              borderColor:
                assistance === "none"
                  ? colors.primaryColor
                  : colors.lightPrimaryBlueBorder,
              backgroundColor: assistance === "none" ? colors.primaryColor : "",
              width: "30%",
              alignItems: "center",
            },
          ]}
          onPress={() => setassistance("none")}
        >
          <View style={styles.choiceTextContainer}>
            <Text
              style={[
                commonStyling.title,
                {
                  fontSize: 13,
                  fontFamily: "Bold",
                  textAlign: "center",
                  color: assistance === "none" ? "#ffffff" : colors.titleText,
                },
              ]}
            >
              None
            </Text>
            <Text
              style={[
                styles.choiceDesc,
                commonStyling.subtitle,
                {
                  fontSize: 10,
                  fontFamily: "Medium",
                  color: assistance === "none" ? "#ffffff" : colors.titleText,
                },
              ]}
            >
              Independent
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.choiceCard,
            {
              borderColor:
                assistance === "Minimal"
                  ? colors.primaryColor
                  : colors.lightPrimaryBlueBorder,
              backgroundColor:
                assistance === "Minimal" ? colors.primaryColor : "",
              width: "30%",
              alignItems: "center",
            },
          ]}
          onPress={() => setassistance("Minimal")}
        >
          <View style={styles.choiceTextContainer}>
            <Text
              style={[
                commonStyling.title,
                {
                  fontSize: 13,
                  fontFamily: "Bold",
                  textAlign: "center",
                  color:
                    assistance === "Minimal" ? "#ffffff" : colors.titleText,
                },
              ]}
            >
              Minimal
            </Text>
            <Text
              style={[
                styles.choiceDesc,
                commonStyling.subtitle,
                {
                  fontSize: 10,
                  fontFamily: "Medium",
                  color:
                    assistance === "Minimal" ? "#ffffff" : colors.titleText,
                },
              ]}
            >
              Light support
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.choiceCard,
            {
              borderColor:
                assistance === "Full"
                  ? colors.primaryColor
                  : colors.lightPrimaryBlueBorder,
              backgroundColor: assistance === "Full" ? colors.primaryColor : "",
              width: "30%",
              alignItems: "center",
            },
          ]}
          onPress={() => setassistance("Full")}
        >
          <View style={styles.choiceTextContainer}>
            <Text
              style={[
                commonStyling.title,
                {
                  fontSize: 13,
                  fontFamily: "Bold",
                  textAlign: "center",
                  color: assistance === "Full" ? "#ffffff" : colors.titleText,
                },
              ]}
            >
              Full
            </Text>
            <Text
              style={[
                styles.choiceDesc,
                commonStyling.subtitle,
                {
                  fontSize: 10,
                  fontFamily: "Medium",
                  textAlign: "center",
                  color: assistance === "Full" ? "#ffffff" : colors.titleText,
                },
              ]}
            >
              Complete assistance
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text
        style={[
          commonStyling.title,
          {
            fontFamily: "Bold",
            fontSize: 18,
            marginTop: 32,
          },
        ]}
      >
        Additional Notes
      </Text>
      <Text
        style={[
          styles.subLabel,
          commonStyling.subtitle,
          {
            fontSize: 14,
            marginBottom: -8,
          },
        ]}
      >
        Any special instructions for the driver
      </Text>
      <MultilineInput
        title=""
        value={additionalNotes}
        onChangeText={(val) => setadditionalNotes(val)}
        placeholder="E.g I need help getting to the car please be extra patient....."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingVertical: 10 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },
  mainTitle: {
    marginTop: 32,
  },
  stepIndicator: { marginTop: 4 },
  progressContainer: { flexDirection: "row", marginTop: 16, marginBottom: 32 },
  progressStep: { flex: 1, height: 4, borderRadius: 2, marginRight: 6 },
  sectionSubtitle: {
    marginTop: 4,
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainerSelected: { backgroundColor: "#2E66E7" },
  cardDesc: { marginTop: 4 },
  badge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: { color: "#15803D", fontSize: 10, fontWeight: "700" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: -150,
  },
  gridCard: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  gridIcon: { marginBottom: 12 },
  vehicleThumb: {
    width: 60,
    height: 40,
    backgroundColor: "#E2E8F0",
    borderRadius: 8,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2E66E7",
    marginTop: 8,
  },

  continueButton: {
    backgroundColor: "#2E66E7",
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2E66E7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  row: { flexDirection: "row", alignItems: "center" },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  placeholder: { height: 300, alignItems: "center", justifyContent: "center" },
  reviewCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    marginBottom: 16,
  },
  reviewHeader: { fontWeight: "700", fontSize: 16 },

  title: { fontSize: 24, fontWeight: "800", color: "#0F172A" },

  progressBar: { flexDirection: "row", gap: 6, marginBottom: 32 },
  progressSegment: { height: 4, flex: 1, borderRadius: 2 },
  activeSegment: { backgroundColor: "#2563EB" },
  inactiveSegment: { backgroundColor: "#E2E8F0" },

  subLabel: { marginTop: 4, marginBottom: 20 },

  choiceCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  activeIconBox: { backgroundColor: "#2563EB" },
  choiceTextContainer: { flex: 1 },
  choiceDesc: { marginTop: 2 },
  passengerFields: {
    marginTop: 4,
    marginBottom: 8,
  },
  nameRow: {
    flexDirection: "row",
    gap: 12,
  },
  nameField: {
    flex: 1,
  },
  textInput: {
    height: 52,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    fontFamily: "Medium",
    marginBottom: 14,
  },
  routePill: {
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  inputGroup: { marginBottom: 24 },
  inputLabel: { marginBottom: 8 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 14, fontWeight: "600", color: "#1E293B" },

  primaryContinueBtn: {
    height: 56,
    backgroundColor: "#2563EB",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  primaryContinueText: { color: "#FFF", fontSize: 16, fontWeight: "700" },

  dateTimeRow: { flexDirection: "row", gap: 12 },
  dateTimeInput: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },

  toggleCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 32,
  },
  toggleInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  toggleSub: { marginTop: 2 },

  frequencyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  gridItem: {
    width: "48%",
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  datePickerInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
  },

  tabContainer: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  activeTab: {
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 1,
  },

  infoCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  recurringBorder: { borderColor: "#2563EB", borderWidth: 1 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  editBtn: { flexDirection: "row", alignItems: "center", gap: 4 },

  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  detailLabel: { marginLeft: 8, flex: 1 },
  placeholderIcon: { width: 16 },

  routeItem: { flexDirection: "row", marginBottom: 16 },
  routeTextContainer: { marginLeft: 12 },
  routeLabel: {
    textTransform: "uppercase",
  },
  addressText: {
    marginTop: 2,
  },
  divider: { height: 1, marginVertical: 12 },
  dateValue: {
    marginTop: 2,
  },

  passengerHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  reviewBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  reviewBadgeText: { fontSize: 10, fontWeight: "700", color: "#92400E" },
  pillRow: { flexDirection: "row", gap: 6, marginTop: 6 },
  grayPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  notesLabel: {
    marginTop: 16,
  },
  notesText: { marginTop: 4 },

  disclaimer: {
    textAlign: "center",
    marginTop: 4,
    marginBottom: 24,
  },

  approvalNotice: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  approvalTitle: {
    marginBottom: 4,
  },
  approvalText: { lineHeight: 18 },

  paymentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    position: "relative",
  },
  defaultBadge: {
    position: "absolute",
    top: -10,
    left: 20,
    backgroundColor: "#FFF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardInfo: { flexDirection: "row", alignItems: "center", gap: 16 },
  logoContainer: {
    width: 60,
    height: 40,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTypeLogo: { fontSize: 14, fontWeight: "900", fontStyle: "italic" },
  mcCircle: { width: 20, height: 20, borderRadius: 10, opacity: 0.8 },
  expiry: { marginTop: 2 },

  addNewBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: "dashed",
    gap: 16,
    marginBottom: 32,
  },
  plusIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  addNewSub: { fontSize: 13, color: "#94A3B8", marginTop: 2 },

  summaryCard: { borderRadius: 24, padding: 24 },
  summaryTitle: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryDivider: { height: 1, backgroundColor: "#E2E8F0", marginVertical: 16 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  payBtn: {
    height: 64,
    backgroundColor: "#2563EB",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  payBtnText: { color: "#FFF", fontSize: 18, fontWeight: "700" },

  iconGlow: {
    width: 106,
    height: 106,
    borderRadius: 60,
    backgroundColor: "rgba(16, 185, 129, 0.1)", // Light emerald glow
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkCircle: {
    width: 96,
    height: 96,
    borderRadius: 50,
    backgroundColor: "#10B981", // Emerald 500
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  statusInfo: {
    textAlign: "center",
    lineHeight: 24,
  },
  statusDetail: {
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 16,
  },

  amountCard: {
    width: "100%",
    borderRadius: 24,
    paddingVertical: 32,
    alignItems: "center",
    marginBottom: 24,
  },
  amountLabel: {
    letterSpacing: 1,
    marginBottom: 8,
  },

  statusBtn: {
    width: "100%",
    height: 64,
    backgroundColor: "#2563EB",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  statusBtnText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  cardGroup: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },

  paymentRow: { flexDirection: "row", alignItems: "center", padding: 16 },

  textContent: { flex: 1, marginLeft: 12 },
  titleRow: { flexDirection: "row", alignItems: "center" },
  defaultText: { color: "#22C55E", fontSize: 10, fontWeight: "800" },
});

export default TripStructure;
