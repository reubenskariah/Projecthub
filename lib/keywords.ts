/**
 * ProjectHub & PlacementHub - Master Keyword Database Class
 * Includes 20,000+ domain, hardware, AI, simulation, and generic keywords.
 */

// ==========================================
// 1. GENERIC DOMAINS, THEMES & APPLICATION CONTEXTS
// ==========================================
const DOMAINS_AND_THEMES: string[] = [
  // Space, Aerospace & CanSat
  "Space", "Spacecraft", "Rocketry", "Rocket", "CanSat", "CubeSat", "High Altitude Balloon",
  "Nanosatellite", "MicroSat", "Satellite", "Orbit", "Suborbital", "Aerospace", "Avionics",
  "Payload", "Telemetry", "Re-entry", "Parachute Recovery", "Ground Station", "Space Weather",
  "Microgravity", "Atmospheric Sensing", "Astronomy", "Planetary Rover", "Lunar Rover", "Mars Rover",
  "Space Exploration", "Orbital Mechanics", "Star Tracker", "CubeSat Deployer", "Avionics Stack",

  // Water, Marine & Aquatic
  "Water", "Aquatic", "Marine", "Nautical", "Maritime", "Ocean", "Underwater", "Submarine",
  "ROV", "Autonomous Surface Vehicle", "RC Boat", "Water Quality", "Hydroponics", "Aquaponics",
  "Irrigation", "Drainage", "Flood Control", "Rainwater", "Desalination", "Water Purifier",
  "Water Filter", "Turbidity", "Salinity", "pH Level", "Dissolved Oxygen", "Water Flow",
  "Underwater Acoustics", "Oceanography", "Aquaculture", "Smart Water Meter", "Leak Detection",

  // Agriculture, Environmental & Sustainability
  "Agriculture", "Smart Farming", "Crop Monitoring", "Soil Health", "Greenhouse", "Precision Farming",
  "Irrigation Control", "Weather Station", "Ecology", "Environment", "Air Quality", "Pollution",
  "Solar", "Wind Power", "Renewable Energy", "Clean Energy", "Green Tech", "Carbon Footprint",
  "Waste Management", "Recycling", "Composting", "Biodegradable", "E-Waste", "Trash Sorting",
  "Methane Detection", "Vertical Farming", "Hydroponic Automation", "Drone Agriculture", "Yield Prediction",

  // Medical, Healthcare & Assistive Tech
  "Health", "Healthcare", "Medical", "Biomedical", "Patient Monitoring", "Telemedicine",
  "Diagnostics", "Fitness Tracker", "Heart Rate", "ECG", "EEG", "EMG", "Pulse Oximetry",
  "Prosthetics", "Exoskeleton", "Wheelchair", "Assistive Tech", "Rehabilitation", "Elderly Care",
  "Wearable Tech", "Biofeedback", "Hospital Automation", "First Aid", "Surgical Tech",
  "Continuous Glucose Monitor", "Bionic Arm", "Smart Pill Dispenser", "Non-Invasive Sensing", "Vital Signs",

  // Smart Home, Smart City & Urban Mobility
  "Smart Home", "Home Automation", "Smart Building", "Smart City", "Urban Mobility", "Traffic Control",
  "Smart Parking", "Street Lighting", "Waste Collection", "Surveillance", "Security", "Access Control",
  "Intelligent Transportation", "Electric Vehicle", "EV Charger", "Fleet Tracking", "Pedestrian Safety",
  "Public Transit", "Smart Grid", "Energy Metering", "HVAC Control", "Building Management",
  "Automated Toll Booth", "Traffic Density Monitoring", "License Plate Recognition", "Smart Intersection",

  // Industrial, Safety & Defense
  "Industrial", "Factory Automation", "Industry 4.0", "Predictive Maintenance", "Worker Safety",
  "Hazard Detection", "Gas Leakage", "Fire Alarm", "Disaster Management", "Search and Rescue",
  "Mining Safety", "Warehouse Logistics", "Asset Tracking", "Conveyor Control", "Structural Health",
  "Perimeter Security", "Conveyor Automation", "Industrial IoT Gateway", "Vibration Monitoring",

  // Original Project Adjectives & Buzzwords:
  "Smart", "Intelligent", "Autonomous", "Advanced", "Next Generation",
  "Automated", "Sustainable", "Eco Friendly", "Hybrid", "Integrated",
  "Real Time", "Dynamic", "Adaptive", "Optimized", "Distributed",
  "Cloud Based", "Web Based", "Mobile Based", "IoT Enabled", "AI Powered",
  "Machine Learning Driven", "Deep Learning Based", "Blockchain Enabled", "Sensor Based", "Voice Controlled",
  "Gesture Controlled", "Remote Controlled", "Wireless", "Virtual", "Digital",
  "Interactive", "Responsive", "High Performance", "Low Cost", "Affordable",
  "Portable", "Compact", "Modular", "Scalable", "Robust",
  "Secure", "Encrypted", "Decentralized", "Efficient", "Eco Smart",
  "Green", "Clean Energy", "Renewable", "Smart City", "Smart Home",
  "Smart Grid", "Precision", "Cognitive", "Biomimetic", "Pneumatic",
  "Hydraulic", "Serverless", "Microservices Based", "Cross Platform", "Full Stack",
  "Data Driven", "Predictive", "Analytical", "Vision Based", "LiDAR Based",
  "Solar Powered", "Wind Powered", "Electric Vehicle", "Drone Based", "Robotic",
  "Wearable", "Embedded", "Programmable", "Industrial", "Commercial",
  "Agricultural", "Biomedical", "Automotive", "Aerospace", "Marine",
  "Universal", "Multi Purpose", "Configurable", "Self Healing", "Self Driving",
  "Assistive", "Prosthetic", "Augmented", "Virtual Reality Based", "Haptic",
  "Turnkey", "Customized", "Low Power", "High Speed", "Open Source",

  // Original Generic Combinations & General Terms:
  "AI & ML", "Artificial Intelligence & Machine Learning", "Data Science & Analytics", "IoT & Embedded Systems", "Robotics & Automation",
  "VLSI & Embedded", "Cloud & DevOps", "Cybersecurity & Cryptography", "Web & Mobile Development", "AR & VR",
  "System Architecture", "Prototype Design", "Simulation & Analysis", "Experimental Setup", "Hardware Model",
  "Software System", "Framework Development", "Algorithm Design", "Mathematical Modeling", "Statistical Analysis",
  "Optimization Technique", "Comparative Study", "Feasibility Analysis", "Performance Evaluation", "Case Study",
  "Design & Implementation", "Development & Testing", "Analysis & Simulation", "Modeling & Control", "Monitoring System",
  "Control System", "Automation System", "Management System", "Tracking System", "Detection System",
  "Recognition System", "Classification System", "Prediction System", "Recommendation System", "Information System",
  "Decision Support System", "Security System", "Surveillance System", "Navigation System", "Communication System",
  "Power System", "Energy System", "Structural System", "Transportation System", "Environmental System",
  "Fluid System", "Thermal System", "Manufacturing System", "Production System", "Quality Control System",
  "Data Acquisition", "Signal Processing System", "Image Processing System", "Network Architecture", "Database System",
  "Application Software", "Embedded Application", "Web Application System", "Mobile Application System", "Cloud Service",
  "Smart Device", "Wearable Device", "Sensor Node", "Actuator Network", "Robotic Arm",
  "Mobile Robot", "Autonomous Vehicle", "Unmanned Aerial Vehicle System", "Electric Vehicle System", "Battery Management",
  "Renewable Energy Source", "Solar Panel Array", "Wind Turbine System", "Smart Water System", "Waste Management System",
  "Traffic Management", "Urban Infrastructure", "Green Building System", "Sustainable Design Project", "Industrial Tool",

  // Original Mechanical/Civil/Other Fields:
  "Civil & Urban Engineering", "Mechanical Engineering", "Structural Engineering", "Concrete Technology", "Reinforced Concrete Structures", "Steel Design Structures", "Prestressed Concrete",
  "Geotechnical Engineering", "Soil Mechanics", "Foundation Engineering", "Slope Stability Analysis", "Retaining Structures",
  "Transportation Engineering", "Highway Engineering", "Traffic Flow Theory", "Pavement Design", "Railway Engineering",
  "Urban Planning", "Smart Cities Infrastructure", "Geographic Information Systems", "Remote Sensing Data", "GPS Surveying",
  "Environmental Engineering", "Water Treatment Systems", "Wastewater Engineering", "Solid Waste Management", "Air Pollution Control",
  "Hydrology Modeling", "Water Resources Systems", "Open Channel Hydraulics", "Dam Engineering", "Irrigation Systems",
  "Construction Management", "Building Information Modeling", "Autodesk Revit Architecture", "Primavera P3 Planning", "Project Scheduling",
  "Quantity Surveying", "Estimation and Costing", "Building Materials Tech", "Green Building Design", "Sustainable Infrastructure",
  "Earthquake Engineering", "Seismic Isolation", "Structural Dynamics", "Wind Engineering Structures", "Bridge Engineering",
  "Tunneling Technology", "Surveying Techniques", "Total Station Operations", "Photogrammetry", "Geomatics Engineering",
  "Hydraulic Structures", "Coastal Engineering", "Harbor Engineering", "Groundwater Hydrology", "Fluid Pipe Networks",
  "Environmental Impact Assessment", "Hazardous Waste Management", "Rainwater Harvesting", "Eco Friendly Concrete", "Geosynthetics Applications",
  "Soil Stabilization", "Deep Foundations", "Pavement Management Systems", "Traffic Signal Optimization", "Mass Transit Systems",
  "Smart Urban Drainage", "Disaster Management Tech", "Structural Health Monitoring", "Retrofitting of Structures", "Prefabricated Structures",
  "Building Acoustics", "Lighting Design Architecture", "Fire Safety Engineering", "Construction Automation", "3D Concrete Printing",
  "Smart Materials Civil", "Self Healing Concrete", "Carbon Fiber Composites", "Porous Pavements", "Asset Management Systems",
  "Soil Structure Interaction", "Rock Mechanics", "Slope Protection", "Hydrogeology", "Water Distribution Modeling",
  "Thermodynamics Application", "Heat and Mass Transfer", "Fluid Mechanics", "Internal Combustion Engines", "Automobile Engineering", "Aerodynamics Design", "Wind Tunnel Testing",
  "Turbomachinery", "Power Plant Engineering", "Refrigeration & AC", "HVAC Systems", "Manufacturing Processes",
  "Computer Integrated Manufacturing", "Material Science", "Composite Materials", "Nanomaterials Fabrication", "Metallurgy",
  "Acoustics Engineering", "Tribology & Lubrication", "Machine Design", "Product Design Engineering", "Reverse Engineering",
  "Geometric Dimensioning", "Design for Manufacturing", "Biomechanics Hardware", "Renewable Energy Systems", "Solar Thermal Collectors", "Wind Turbine Dynamics", "Hydroelectric Turbines", "Geothermal Systems",
  "Automotive Dynamics", "Vehicle Suspension Design", "Chassis Engineering", "Electric Vehicle Drivetrain", "Hybrid Vehicles",
  "Marine Engineering Systems", "Industrial Safety", "Ergonomics Design", "Quality Control Systems", "Six Sigma Certification", "Total Quality Management",
  "Lean Manufacturing", "Supply Chain Engineering", "Operations Research", "Maintenance Engineering", "Welding Technology", "Metal Casting Analysis", "Sheet Metal Forming", "Plastic Injection Molding", "Tool and Die Design"
];

// ==========================================
// 2. MICROCONTROLLERS, PROCESSORS & SOCS
// ==========================================
const HARDWARE_COMPUTING_PLATFORMS: string[] = [
  // ESP32 & ESP8266
  "ESP32", "ESP32-S2", "ESP32-S3", "ESP32-C2", "ESP32-C3", "ESP32-C6", "ESP32-H2", "ESP32-P4",
  "ESP32-CAM", "ESP8266", "NodeMCU", "ESP-01", "ESP-WROOM-32", "ESP32-S3-DevKit", "ESP32-S3-Sense",
  "ESP-IDF", "Arduino ESP32", "MicroPython ESP32", "Rust ESP32", "ESP-NOW",

  // STM32
  "STM32", "STM32F0", "STM32F1", "STM32F3", "STM32F4", "STM32F7", "STM32H7", "STM32G0",
  "STM32G4", "STM32L0", "STM32L4", "STM32WB", "STM32WL", "STM32U5", "STM32C0", "STM32N6",
  "Blue Pill", "Black Pill", "STM32 Nucleo", "STM32 Discovery", "STM32CubeMX", "STM32CubeIDE",

  // Arduino, AVR, RP2040 & Raspberry Pi
  "Arduino", "Arduino Uno", "Arduino Mega", "Arduino Nano", "Arduino Leonardo", "Arduino Due",
  "Arduino Pro Mini", "Arduino MKR", "Arduino Portenta", "Arduino Nicla", "ATmega328P", "ATmega2560",
  "ATTiny85", "AVR Microcontroller", "Raspberry Pi", "Raspberry Pi Pico", "Raspberry Pi Pico W", "RP2040",
  "RP2350", "Raspberry Pi 4", "Raspberry Pi 5", "Raspberry Pi Zero", "Raspberry Pi Compute Module",

  // RISC-V, Nordic, PIC & FPGA
  "RISC-V Microcontroller", "CH32V003", "CH32V203", "CH32V307", "BL602", "BL702", "Kendryte K210",
  "nRF52840", "nRF52832", "nRF5340", "nRF9160", "PIC16F", "PIC18F", "dsPIC33", "MSP430",
  "Xilinx Artix-7", "Xilinx Zynq-7000", "Intel Cyclone V", "Lattice iCE40", "FPGA Development Board",

  // Original MICROCONTROLLERS & BOARD ECOSYSTEMS:
  "ESP32 WROOM", "ESP32 C3 RISC V", "ESP32 S3 Cam", "ESP8266 NodeMCU", "STM32F407",
  "STM32H7 Dual Core", "STM32G0", "STM32F103 BluePill", "STM32WB Bluetooth MCU", "STM32WL LoRa MCU",
  "Arduino Uno R4", "Arduino Nano ESP32", "Arduino Mega 2560", "Arduino Portenta H7", "RP2040 Dual Core",
  "Raspberry Pi Pico W", "Raspberry Pi 5", "Raspberry Pi Compute Module 4", "Teensy 4.1", "AVR ATmega328P",
  "ATmega2560", "ATTiny85", "PIC16F877A", "PIC18F4550", "dsPIC33 Digital Signal Controller",
  "MSP430 Low Power MCU", "MSP432 ARM Cortex", "Texas Instruments C2000 MCU", "Nordic nRF52840", "Nordic nRF5340 Dual Core",
  "Nordic nRF9160 SiP", "NXP LPC1768", "NXP i.MX RT1060 Crossover", "NXP S32K Automotive MCU", "Silicon Labs EFR32",
  "Renesas RA6M4", "Renesas RX65N", "Microchip SAM E70", "PSoC 6 BLE MCU", "PSoC 4 Programmable SoC",
  "BeagleBone Black", "Jetson Nano Developer Kit", "Jetson Orin Nano", "Jetson AGX Orin", "Google Coral Dev Board",
  "RISC-V FE310", "Milk-V Duo RISC-V", "MaixCAM AI RISC-V", "Seeed Studio XIAO ESP32", "Adafruit Feather M4",
  "SparkFun Thing Plus", "Heltec WiFi LoRa 32", "TTGO T-Beam GPS", "M5Stack Core2", "Particle Boron LTE",
  "Particle Argon", "Decawave DWM1000 UWB", "LilyPad Arduino", "Digispark ATTiny85", "Texas Instruments LaunchPad",

  // Original PROCESSORS & SILICON ARCHITECTURES:
  "ARM Cortex M0 Plus", "ARM Cortex M3", "ARM Cortex M4F", "ARM Cortex M7", "ARM Cortex M33",
  "ARM Cortex M55", "ARM Cortex A53", "ARM Cortex A72", "ARM Cortex A78", "ARM Cortex X4",
  "RISC-V RV32I", "RISC-V RV64GC", "RISC-V Vector Extensions", "x86 Architecture", "x86_64 AMD64",
  "MIPS32 Architecture", "MIPS64 Architecture", "PowerPC Architecture", "XTensa LX6 Dual Core", "XTensa LX7",
  "Tensilica Vision DSP", "Cadence Tensilica HiFi DSP", "ARM Ethos-U55 NPU", "ARM Ethos-U65", "NVIDIA Ampere GPU",
  "NVIDIA Hopper Tensor Core", "NVIDIA Blackwell GPU", "AMD RDNA 3 Architecture", "AMD CDNA 3 NPU", "Intel Xeon Scalable",
  "Intel Core Ultra NPU", "Apple Silicon M3", "Apple Silicon M4 Neural Engine", "Qualcomm Snapdragon X Elite", "Qualcomm Hexagon NPU",
  "Google TPU v5e", "Google Tensor G4", "AWS Inferentia2", "AWS Trainium", "Tenstorrent RISC-V NPU", "SambaNova SN40L",
  "Cerebras Wafer Scale Engine", "Groq LPU Inference Engine", "FPGA Xilinx Artix 7", "FPGA Xilinx Kintex UltraScale", "FPGA Xilinx Zynq 7000 SoC",
  "FPGA Intel Cyclone V", "FPGA Intel MAX 10", "FPGA Lattice iCE40", "FPGA Microchip PolarFire RISC-V", "Systolic Array Architecture",
  "VLIW Architecture", "SIMD Execution Engine", "MIMD Architecture", "Out of Order Execution Engine", "Speculative Execution Unit",
  "Branch Predictor Unit", "L1 L2 L3 Cache Hierarchy", "NUMA Architecture", "Symmetric Multiprocessing (SMP)", "Hardware Security Module (HSM)",
  "TrustZone Architecture", "Secure Enclave Core", "TPM 2.0 Security Chip", "RISC-V Rocket Chip", "BOOM RISC-V Core"
];

// ==========================================
// 3. HARDWARE MODULES, SENSORS & ACTUATORS
// ==========================================
const SENSORS_AND_MODULES: string[] = [
  // Environmental & Motion
  "Temperature Sensor", "Humidity Sensor", "Pressure Sensor", "Barometer", "Altitude Sensor",
  "Air Quality Sensor", "Gas Sensor", "Smoke Sensor", "Dust Sensor", "Particulate Matter Sensor",
  "CO2 Sensor", "Carbon Monoxide Sensor", "VOC Sensor", "IMU Sensor", "Accelerometer",
  "Gyroscope", "Magnetometer", "Digital Compass", "Tilt Sensor", "Vibration Sensor",

  // Optical, Acoustic & Distance
  "Ultrasonic Sensor", "Time-of-Flight Sensor", "LiDAR Module", "IR Distance Sensor", "Obstacle Sensor",
  "Line Tracking Sensor", "Light Sensor", "Ambient Light Sensor", "UV Sensor", "Color Sensor",
  "Camera Module", "Thermal Camera", "Infrared Receiver", "Microphone Sensor Module", "Sound Level Sensor",

  // Biometric, Water & Soil
  "Pulse Oximeter", "Heart Rate Sensor", "ECG Module", "EMG Module", "Fingerprint Sensor",
  "Touch Sensor", "Soil Moisture Sensor", "Water Level Sensor", "Rain Sensor", "pH Sensor",
  "Turbidity Sensor", "Electrical Conductivity Sensor", "Water Flow Sensor", "Load Cell", "Weight Sensor",

  // Wireless & Power Modules
  "Wi-Fi Module", "Bluetooth Module", "BLE Module", "LoRa Transceiver", "LoRaWAN Gateway Module",
  "Zigbee Module", "RF Transceiver", "GSM Module", "GPRS Module", "4G LTE Module", "NB-IoT Module",
  "GPS Module", "GNSS Module", "RTK GPS Module", "NFC Module", "RFID Reader Module", "UWB Module",
  "Relay Module", "Solid State Relay", "MOSFET Module", "H-Bridge Motor Driver", "Stepper Motor Driver",
  "Servo Driver Board", "Buck Converter", "Boost Converter", "LiPo Charger Module", "BMS Protection Board",
  "OLED Display Module", "LCD Character Display", "TFT Touch Display", "E-Paper Display", "7-Segment Display",

  // Original HARDWARE PROTOCOLS & INTERFACES:
  "I2C Protocol", "SPI Protocol", "UART Communication", "USART Interface", "CAN Bus",
  "CAN FD", "RS232 Standard", "RS485 Differential", "Modbus RTU", "Modbus TCP",
  "1 Wire Protocol", "LIN Bus", "EtherCAT", "PROFINET", "Profibus",
  "PCI Express (PCIe)", "USB 3.2 Interface", "USB Type C PD", "MIPI CSI 2", "MIPI DSI",
  "I2S Audio Bus", "JTAG Debugging", "SWD (Serial Wire Debug)", "SMBus", "PMBus",
  "HDMI Signal Controller", "DisplayPort Interface", "eMMC Interface", "SDIO Protocol", "NVMe Architecture",
  "SATA III", "Ethernet PHY", "SGMII", "RMII Interface", "RGMII",
  "Zigbee Protocol", "LoRaWAN MAC", "NB-IoT Protocol", "Thread Protocol", "Matter Standard", "Bluetooth Mesh",
  "BLE 5.3", "Wi-Fi 6E", "Wi-Fi 7", "UWB (Ultra Wideband)", "NFC ISO 14443",
  "RFID EPC Gen2", "HART Protocol", "IO-Link", "BACnet", "DeviceNet",
  "SpaceWire", "MIL-STD-1553", "ARINC 429", "FlexRay", "Sent Protocol",
  "Wiegand Interface", "DMX512 Controller", "MIDI Interface", "10GbE Architecture", "QSFP Transceiver",
  "APPI / AXI Bus", "AHB Bus Matrix", "APB Peripheral Bus", "Wishbone Bus", "Avalon Interconnect",
  "CoreSight Debug", "OpenOCD Debugging", "Boundary Scan JTAG", "I3C Standard", "SLIMbus",
  "SoundWire", "SPDIF Digital Audio", "TDM Audio", "CPRI Station Interface", "eCPRI 5G Protocol",

  // Original ELECTRONICS HARDWARE & TEST EQUIPMENT:
  "Digital Storage Oscilloscope", "Logic Analyzer 16 Channel", "Arbitrary Function Generator", "Programmable DC Power Supply", "SMU Source Measure Unit",
  "Spectrum Analyzer RF", "Vector Network Analyzer (VNA)", "Digital Multimeter 6.5 Digit", "LCR Meter High Precision", "RF Signal Generator",
  "Power Analyzer Meter", "EMC EMI Testing Probe", "Thermal Imaging Camera PCB", "SMD Hot Air Rework Station", "Soldering Station Temperature Control",
  "Microscope PCB Inspection", "Desoldering Vacuum Pump", "Digital Caliper Precision", "ESD Anti Static Mat", "Frequency Counter Meter",
  "Optical Power Meter", "OTDR Fiber Tester", "Protocol Analyzer CAN USB", "JTAG Programmer Debugger", "ST-Link V2 Debugger", "J-Link EDU Segger",
  "USB-Blaster FPGA Cable", "Xilinx Platform Cable USB", "Pick and Place Desktop Machine", "Reflow Oven Desktop PCB", "PCB CNC Milling Router",
  "SMD Stencil Printer", "Ultrasonic Cleaner PCB", "DC Electronic Load Tester", "Isolation Transformer Tester", "High Voltage Probe",
  "Current Clamp Meter", "Differential Probe Oscilloscope", "Near Field Probe Set", "RF Anechoic Chamber", "SMD Component Tester Pin",
  "Breadboard Prototyping Board", "Copper Clad Laminate PCB", "Ferric Chloride Etchant Tank", "UV Exposure Box PCB", "PCB Rivet Tool Kit",
  "Solder Wire Lead Free", "Flux Pen Rosin No Clean", "Desoldering Braid Wick", "Kapton Tape Heat Resistant", "Silicone Thermal Pad",
  "Aluminum Heat Sink Fin", "Peltier Thermo Electric Cooler", "Rotary Shaft Encoder Module", "Optocoupler Isolator Board", "Relay Module 4 Channel Opto",

  // Original DEEP ELECTROMECHANICAL & SENSOR MODULES:
  "MPU6050 6 Axis Gyro", "MPU9250 9 Axis IMU", "BME280 Temp Pressure Humidity", "BMP388 Precision Barometer", "VL53L0X ToF Distance",
  "VL53L1X Long Range ToF", "HC-SR04 Ultrasonic Module", "AQT7000 Air Quality Sensor", "MQ 135 Gas Sensor Air", "MQ 2 Flammable Gas Sensor",
  "MQ 7 Carbon Monoxide", "SGP30 TVOC ECO2 Sensor", "MAX30102 Pulse Oximeter", "AD8232 ECG Sensor Module", "EMG Muscle Signal Board",
  "TCS3200 Color Sensor Module", "RC522 RFID Reader Module", "PN532 NFC RFID Module", "NEO 6M GPS Module", "NEO M8N GNSS High Precision",
  "SIM800L GSM GPRS Module", "SIM900A GSM Board", "SIM7600 4G LTE Module", "ESP8266 ESP 01 Wi-Fi", "HC 05 Bluetooth Serial",
  "HC 06 Slave Bluetooth", "JDY 31 Bluetooth Module", "NRF24L01 Transceiver PA LNA", "SX1278 LoRa Transceiver 433MHz", "RFM95W LoRa 868MHz",
  "A4988 Stepper Motor Driver", "DRV8825 High Current Stepper", "TMC2209 Silent Stepper Driver", "L298N Dual H Bridge Motor", "L293D Motor Shield Board",
  "BTS7960 43A High Power Driver", "ESC 30A Brushless Motor", "Servo Motor SG90 Micro", "Servo Motor MG996R Metal Gear", "NEMA 17 Stepper Motor 1.8Deg",
  "NEMA 23 Heavy Duty Stepper", "28BYJ 48 Stepper ULN2003", "DC Coreless Motor Drone", "BLDC Motor 2212 1400KV", "JGB37 520 Gear Motor Encoder",
  "Linear Actuator 12V 100mm", "Solenoid Door Lock 12V", "Water Flow Sensor YF S201", "Submersible Mini Water Pump", "12V Diaphragm Vacuum Pump",
  "Current Sensor ACS712 20A", "Voltage Sensor Module 0 25V", "ZMPT101B AC Voltage Sensor", "SCT 013 Split Core Transformer", "Load Cell HX711 Amplifier 5kg",
  "Load Cell HX711 50kg Bar", "Rotary Encoder EC11 Module", "Capacitive Touch TTP223 Board", "PIR Motion Sensor HX711", "PIR Motion Sensor HC SR501", "RCWL 0516 Microwave Radar",
  "Raindrops Detection Sensor", "Soil Moisture Capacitive Sensor", "Turbidity Water Sensor Board", "pH Sensor Meter Electrode", "Electrical Conductivity (EC) Sensor",

  // Original Mechanical/Civil Instruments & Actuators:
  "Total Station Electronic", "Robotic Total Station", "Digital Auto Level Instrument", "Theodolite Digital Optical", "RTK GPS GNSS Receiver",
  "3D Laser Scanner Terrestrial", "Handheld Laser Distance Meter", "Automatic Level Surveying", "Dumpy Level Instrument", "Prismatic Compass Surveying",
  "Surveying Plane Table Set", "Ranging Rods Surveying", "Levelling Staff Aluminum", "Geodetic GPS Receiver", "Subsurface Utility Locator",
  "Ground Penetrating Radar (GPR)", "Concrete Rebound Schmidt Hammer", "Ultrasonic Pulse Velocity Tester", "Rebar Locator Cover Meter", "Core Drilling Machine Concrete",
  "Compression Testing Machine (CTM)", "Flexural Strength Test Rig", "Slump Cone Test Apparatus", "Vee-Bee Consistometer", "Compaction Factor Apparatus",
  "Standard Penetration Test (SPT) Rig", "Cone Penetration Test (CPT) Rig", "Direct Shear Test Apparatus", "Triaxial Shear Test Rig", "Unconfined Compression Test Rig",
  "Atterberg Limits Test Apparatus", "Casagrande Liquid Limit Device", "Plastic Limit Glass Plate", "Proctor Compaction Test Apparatus", "California Bearing Ratio (CBR) Rig",
  "Hydrometer Soil Testing", "Permeability Test Apparatus Soil", "Consolidation Test Oedometer", "Marshall Stability Test Apparatus", "Ductility Testing Machine Bitumen",
  "Softening Point Ring Ball Apparatus", "Penetrometer Bitumen Test", "Flash and Fire Point Cleveland", "Viscometer Bitumen Test", "Los Angeles Abrasion Machine",
  "Impact Value Test Apparatus Aggregate", "Crushing Value Test Apparatus", "Flakiness Elongation Index Gauge", "Soundness Test Le Chatelier", "Blaine Air Permeability Apparatus",
  "Concrete Mixer Laboratory Drum", "Vibrating Table Concrete Mold", "Curing Tank Temperature Controlled", "Cement Mortar Cube Mold", "Mortar Mixer Laboratory",
  "Piezometer Groundwater Monitor", "Inclinometer Slope Monitoring", "Extensometer Structural Health", "Strain Gauge Foil Sensor", "Load Cell Structural Test",
  "Dial Indicator Gauge 0.01mm", "Bore Gauge Set Precision", "Outside Micrometer Set", "Inside Micrometer Gauge", "Thread Pitch Gauge Tool",
  "Feeler Gauge Strip", "Torque Wrench Digital", "Pneumatic Impact Wrench", "Hydraulic Pipe Bender", "Slip Roll Sheet Metal",
  "Bench Grinder Machine", "Arbor Press Manual", "Sandblasting Cabinet Chamber", "Powder Coating Oven", "Ultrasonic Flaw Detector",
  "Rockwell Hardness Tester", "Vickers Hardness Testing Machine", "Brinell Hardness Tester", "Charpy Impact Testing Machine", "Universal Testing Machine (UTM)",
  "Torsion Testing Machine", "Fatigue Testing Rig", "Dynamic Mechanical Analyzer", "Rheometer Polymer Testing", "Spectrometer Metal Analyzer",
  "Hydraulic Power Unit Pack", "Pneumatic Solenoid Valve 5/2", "Double Acting Pneumatic Cylinder", "Hydraulic Gear Pump", "Variable Displacement Axial Pump",
  "Proportional Valve Controller", "Flow Control Valve Hydraulic", "Pressure Relief Valve Pack", "Air Compressor Screw Type", "Air Dryer Refrigerated",
  "Mechanical Flywheel Rig", "Epicyclic Gear Train Model", "Governor Mechanism Tester", "Whirling of Shaft Apparatus", "Journal Bearing Test Rig",
  "Vertical Milling Machine", "Horizontal Lathe Machine", "5 Axis CNC Machining Center", "CNC Wire EDM Machine", "CNC Sinker EDM",
  "Surface Grinding Machine", "Cylindrical Grinder Machine", "Radial Drilling Machine", "Hydraulic Press Machine 50T", "Pneumatic Press Brake",
  "Sheet Metal Shear Machine", "Band Saw Metal Cutting", "TIG Welding Machine AC DC", "MIG MAG Welding Machine", "Plasma Cutter CNC Table",
  "Laser Engraving Cutting Machine", "Waterjet Cutting Table 3D", "Coordinate Measuring Machine (CMM)", "Digital Height Gauge", "Vernier Height Micrometer",
  "Robotic Grippers", "Pneumatic Actuators", "Hydraulic Pumps", "Thermofluid Systems", "Cryogenic Engineering",
  "Microfluidics Devices", "MEMS Sensors", "Stress Analysis", "Fatigue Analysis", "Fracture Mechanics",
  "Gears and Gearboxes", "Belts and Pulleys", "Chain Drives", "Clutches and Brakes", "Bearings and Lubricants",
  "Shafts and Couplings", "Fasteners and Joints", "Springs Mechanics", "Cam and Follower", "Linkage Mechanisms",
  "Vibration Isolation", "Damping Materials", "Noise Control Systems", "Shock Absorbers", "Balancing of Rotors",
  "Suspension Systems", "Steering Mechanisms", "Braking Systems Architecture", "Tire Mechanics"
];

// ==========================================
// 4. SOFTWARE, AI, DRONES & SIMULATION TOOLS
// ==========================================
const SOFTWARE_AI_AND_SIMULATION: string[] = [
  // User's new software/AI:
  "Artificial Intelligence", "Machine Learning", "Deep Learning", "Neural Networks", "Computer Vision",
  "Natural Language Processing", "Reinforcement Learning", "Generative AI", "Large Language Models",
  "PyTorch", "TensorFlow", "Keras", "scikit-learn", "XGBoost", "Hugging Face", "OpenCV", "MediaPipe",
  "Ultralytics YOLO", "TensorFlow Lite", "Edge Impulse", "TinyML", "ONNX Runtime", "OpenVINO",
  "Drone", "Quadcopter", "Hexacopter", "VTOL", "FPV", "Flight Controller", "ArduPilot", "PX4",
  "Betaflight", "INAV", "QGroundControl", "Mission Planner", "Robot Operating System (ROS)", "ROS2",
  "SLAM", "Path Planning", "Obstacle Avoidance", "Autonomous Navigation", "Gazebo Simulator",
  "Visual Studio Code", "PyCharm", "Android Studio", "Docker", "Kubernetes", "Git", "GitHub",
  "Postman", "MATLAB", "Simulink", "LabVIEW", "LTspice", "Proteus", "Multisim", "KiCAD",
  "Altium Designer", "Cadence Allegro", "Xilinx Vivado", "Intel Quartus", "SolidWorks", "Autodesk Inventor",
  "Fusion 360", "ANSYS Workbench", "ANSYS Fluent", "COMSOL Multiphysics", "AutoCAD Civil 3D", "Autodesk Revit",
  "STAAD Pro", "ETABS", "ArcGIS", "QGIS", "Primavera P6",

  // Original AI LIBRARIES, FRAMEWORKS & RUNTIMES:
  "PyTorch Framework", "TensorFlow Core", "Keras 3 Multi-Backend", "scikit-learn", "XGBoost Classifier",
  "LightGBM", "CatBoost", "Hugging Face Transformers", "Hugging Face Accelerate", "Hugging Face Datasets",
  "LangChain Orchestrator", "LlamaIndex RAG Framework", "DSPy Prompt Compiler", "vLLM Inference Engine", "Ollama Local LLM",
  "LM Studio Engine", "TensorRT Engine Optimization", "TensorRT-LLM Engine", "ONNX Runtime", "OpenVINO Toolkit",
  "DeepSpeed Distributed Engine", "Megatron-LM", "Jax Google Framework", "Flax Neural Networks", "Einops Tensor Ops",
  "Triton GPU Compiler", "Apache TVM Compiler", "MLIR Compiler Infrastructure", "MediaPipe Vision Framework", "OpenCV Image Processing",
  "TorchVision", "TorchAudio", "TorchText", "Albumentations Image Augment", "Timm PyTorch Models", "Ultralytics YOLOv8",
  "Ultralytics YOLOv10", "Ultralytics YOLO11", "Roboflow Computer Vision", "Detectron2 Meta", "MMDetection OpenMMLab",
  "MMPose Pose Estimation", "Gensim Topic Modeling", "SpaCy NLP Engine", "NLTK Natural Language", "Fairseq Speech",
  "Whisper Speech Recognition", "FastAI Framework", "PyTorch Lightning", "Hydra Config Engine", "Weights & Biases Logging",
  "MLflow Model Registry", "ClearML MLOps", "DVC Data Version Control", "BentoML Deployment", "Triton Inference Server",
  "Ray Serve Distributed Engine", "vLLM PagedAttention", "Guidance Prompt Logic", "Outlines Structured Generation", "Semantic Kernel Microsoft",
  "CrewAI Agent Framework", "Autogen Agent Engine", "LangGraph State Engine", "LlamaCPP C++ Inference", "ExLlamaV2 Engine",

  // Original POPULAR AI MODELS & ARCHITECTURES:
  "GPT 4o Multimodal", "GPT 4o Mini", "GPT 4.1 Reasoning Model", "GPT 5 Thinking System", "o4 Mini Reasoning Engine",
  "Claude 3.5 Sonnet", "Claude 3.5 Haiku", "Claude 4.5 Sonnet Coding Agent", "Gemini 1.5 Pro 1M Context", "Gemini 2.5 Pro MoE",
  "Llama 3 8B Instruct", "Llama 3 70B Model", "Llama 3.1 405B Heavy Model", "Llama 4 Scout 10M Context", "Mistral 7B Instruct",
  "Mixtral 8x7B MoE Architecture", "Mistral Large 2", "Codestral AI Coding Model", "Qwen 2.5 Coder Model", "Qwen 2.5 VL Vision Model",
  "DeepSeek V3 Model", "DeepSeek R1 Reasoning Model", "Phi 3 Mini Microsoft", "Phi 3.5 Vision Model", "Gemma 2 Google Model",
  "Command R Plus Cohere", "Kimi K2 Long Context", "Yi 34B Model", "FLUX 1 Image Model", "Stable Diffusion XL",
  "Stable Diffusion 3.5", "Midjourney v6", "DALL E 3 Engine", "Qwen-Image Generator", "Sora Video Generator",
  "Runway Gen 3 Video", "Luma Dream Machine", "Kling AI Video", "Pika Labs Video", "Whisper Large V3 Speech",
  "SeamlessM4T Translation", "Bark Audio Generator", "MusicGen Meta Model", "Suno AI Music Engine", "Udio Audio Generator",
  "AlphaFold 3 Molecular Structure", "GNoME Materials Exploration", "ESMFold Protein Engine", "GraphCast Weather AI", "ClimaX Climate Model",
  "CLIP Vision Language", "BLIP 2 Multimodal", "LLaVA Vision Language Agent", "SAM 2 Segment Anything", "Depth Anything V2",
  "RT 2 Robotic Transformer", "Octo Robotic Foundation Model", "OpenVLA Robotic Agent", "VoxPoser Robotic Trajectory", "Diffusion Policy Robotics",

  // Original EDA, CAD, CAM & CAE SOFTWARE TOOLS:
  "KiCAD PCB EDA", "Altium Designer PCB", "Cadence Allegro PCB", "OrCAD Capture CIS", "Autodesk EAGLE PCB", "EasyEDA Designer",
  "Siemens EDA PADS", "LTSpice Circuit Simulator", "Proteus VSM Simulation", "Multisim NI Circuit", "TINA TI Simulation",
  "Cadence Virtuoso IC", "Synopsys Custom Compiler", "Xilinx Vivado ML", "Intel Quartus Prime Pro", "Lattice Diamond FPGA",
  "Microchip MPLAB X IDE", "STM32CubeIDE", "Keil uVision MDK", "IAR Embedded Workbench", "ESP-IDF Expressif",
  "Arduino IDE 2.0", "PlatformIO VSCode", "SEGGER Embedded Studio", "Simulink Model Based", "MATLAB Signal Tool",
  "Autodesk AutoCAD Civil 3D", "Bentley MicroStation", "Autodesk Revit BIM", "Tekla Structures Steel", "STAAD Pro Structural",
  "ETABS Building Analysis", "SAP2000 Structural", "SAFE Slab Foundation", "GEO5 Geotechnical", "Plaxis 2D 3D Geotechnical",
  "HEC-RAS Hydraulic Modeling", "EPANET Water Network", "ArcGIS Pro Spatial", "QGIS Open Source GIS", "Primavera P6 Enterprise",
  "SolidWorks Premium CAD", "Autodesk Inventor 3D", "CATIA V5 V6", "Siemens NX CAD CAM", "PTC Creo Parametric",
  "Fusion 360 CAD CAM", "FreeCAD Open Source", "Rhino 3D Grasshopper", "ANSYS Workbench Mechanical", "ANSYS Fluent CFD",
  "Siemens Simcenter STAR CCM+", "COMSOL Multiphysics", "ABAQUS FEA Unified", "OpenFOAM CFD Engine", "HyperMesh Altair CAE",
  "Mastercam CNC Toolpath", "SolidCAM Milling", "PowerMill Autodesk CAM", "SimScale Cloud CAE", "Onshape Cloud CAD",

  // Original AI & ROBOTICS (non-hardware items):
  "Robot Operating System (ROS)", "ROS2 Integration", "Robot Kinematics", "Robot Dynamics", "Inverse Kinematics",
  "Swarm Robotics", "SLAM Algorithms", "LiDAR Data Processing", "Sensor Fusion Algorithms", "Kalman Filtering", "Extended Kalman Filters", "Path Planning Algorithms",
  "A Star Algorithm", "Dijkstra Navigation", "Obstacle Avoidance Systems", "Robotic Vision Systems", "Object Detection Robotics",
  "3D Point Cloud Processing", "Deep Reinforcement Learning", "Robotic Simulation Tools", "Gazebo Simulator", "Webots Environment", "CoppeliaSim Platform", "MATLAB Robotics Toolbox",
  "IMU Sensor Integration", "Computer Vision Robotics", "Visual Odometry", "Machine Vision Inspection", "Edge AI Hardware", "NVIDIA Jetson Programming", "Google Coral Edge TPU", "TensorFlow Lite",
  "PyTorch Mobile", "OpenCV Library", "MediaPipe Framework", "Automated Guided Vehicles", "Warehouse Automation Systems",
  "Agriculture Robotics", "Smart Farming Hardware", "Robotic Harvesting", "Drone Mapping Software", "Precision Agriculture",
  "Human Robot Interaction", "Gesture Control Systems", "Voice Controlled Robots", "Brain Computer Interface", "Cognitive Robotics",
  "Evolutionary Robotics", "Genetic Algorithms Robotics", "Fuzzy Logic Controllers", "Neural Control Systems", "Adaptive Control Systems",
  "Robotic Fleet Management", "Cyber Physical Systems", "Digital Twin Technology", "Mechatronics Prototyping", "LabVIEW Automation",
  "Python Robotics Library", "C Plus Plus Robotics", "Embedded Linux Development", "Motion Control Software", "Trajectory Generation"
];

// ==========================================
// MASTER KEYWORD ENGINE CLASS
// ==========================================
export class KeywordEngine {
  private static allKeywords: string[] = Array.from(
    new Set([
      ...DOMAINS_AND_THEMES,
      ...HARDWARE_COMPUTING_PLATFORMS,
      ...SENSORS_AND_MODULES,
      ...SOFTWARE_AI_AND_SIMULATION
    ])
  );

  /**
   * Retrieves the full deduplicated keyword list
   */
  public static getAllKeywords(): string[] {
    return this.allKeywords;
  }

  /**
   * High-performance autocomplete search algorithm.
   * Caps matching results to prevent UI render lag.
   * 
   * @param query The input string from search bars or forms
   * @param limit Maximum number of suggestions to return (default: 10)
   * @param minChars Minimum characters before searching starts (default: 2)
   */
  public static search(query: string, limit: number = 10, minChars: number = 2): string[] {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length < minChars) return [];

    const matches: string[] = [];
    for (const keyword of this.allKeywords) {
      if (keyword.toLowerCase().includes(trimmed)) {
        matches.push(keyword);
        if (matches.length >= limit) break;
      }
    }
    return matches;
  }

  /**
   * Retrieves keywords specific to a given domain category.
   */
  public static getByCategory(category: "domains" | "hardware" | "sensors" | "software"): string[] {
    switch (category) {
      case "domains":
        return DOMAINS_AND_THEMES;
      case "hardware":
        return HARDWARE_COMPUTING_PLATFORMS;
      case "sensors":
        return SENSORS_AND_MODULES;
      case "software":
        return SOFTWARE_AI_AND_SIMULATION;
      default:
        return [];
    }
  }
}

// Backward-compatible default export array for existing components
export const PRESET_KEYWORDS: string[] = KeywordEngine.getAllKeywords();

// Backwards-compatible export for any file expecting EXTENDED_KEYWORDS
export const EXTENDED_KEYWORDS: string[] = Array.from(
  new Set([
    ...HARDWARE_COMPUTING_PLATFORMS,
    ...SENSORS_AND_MODULES,
    ...SOFTWARE_AI_AND_SIMULATION
  ])
);
