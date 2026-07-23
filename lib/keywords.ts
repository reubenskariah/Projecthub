export const EXTENDED_KEYWORDS = [
  // ==========================================
  // HARDWARE PROTOCOLS & INTERFACES (1 - 100)
  // ==========================================
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

  // ==========================================
  // MICROCONTROLLERS & BOARD ECOSYSTEMS (101 - 200)
  // ==========================================
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

  // ==========================================
  // PROCESSORS & SILICON ARCHITECTURES (201 - 300)
  // ==========================================
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
  "TrustZone Architecture", "Secure Enclave Core", "TPM 2.0 Security Chip", "RISC-V Rocket Chip", "BOOM RISC-V Core",

  // ==========================================
  // AI LIBRARIES, FRAMEWORKS & RUNTIMES (301 - 400)
  // ==========================================
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

  // ==========================================
  // POPULAR AI MODELS & ARCHITECTURES (401 - 500)
  // ==========================================
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

  // ==========================================
  // ELECTRONICS HARDWARE & TEST EQUIPMENT (501 - 600)
  // ==========================================
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

  // ==========================================
  // MECHANICAL TOOLS, MACHINES & HARDWARE (601 - 700)
  // ==========================================
  "Vertical Milling Machine", "Horizontal Lathe Machine", "5 Axis CNC Machining Center", "CNC Wire EDM Machine", "CNC Sinker EDM",
  "Surface Grinding Machine", "Cylindrical Grinder Machine", "Radial Drilling Machine", "Hydraulic Press Machine 50T", "Pneumatic Press Brake",
  "Sheet Metal Shear Machine", "Band Saw Metal Cutting", "TIG Welding Machine AC DC", "MIG MAG Welding Machine", "Plasma Cutter CNC Table",
  "Laser Engraving Cutting Machine", "Waterjet Cutting Table 3D", "Coordinate Measuring Machine (CMM)", "Digital Height Gauge", "Vernier Height Micrometer",
  "Dial Indicator Gauge 0.01mm", "Bore Gauge Set Precision", "Outside Micrometer Set", "Inside Micrometer Gauge", "Thread Pitch Gauge Tool",
  "Feeler Gauge Strip", "Torque Wrench Digital", "Pneumatic Impact Wrench", "Hydraulic Pipe Bender", "Slip Roll Sheet Metal",
  "Bench Grinder Machine", "Arbor Press Manual", "Sandblasting Cabinet Chamber", "Powder Coating Oven", "Ultrasonic Flaw Detector",
  "Rockwell Hardness Tester", "Vickers Hardness Testing Machine", "Brinell Hardness Tester", "Charpy Impact Testing Machine", "Universal Testing Machine (UTM)",
  "Torsion Testing Machine", "Fatigue Testing Rig", "Dynamic Mechanical Analyzer", "Rheometer Polymer Testing", "Spectrometer Metal Analyzer",
  "Hydraulic Power Unit Pack", "Pneumatic Solenoid Valve 5/2", "Double Acting Pneumatic Cylinder", "Hydraulic Gear Pump", "Variable Displacement Axial Pump",
  "Proportional Valve Controller", "Flow Control Valve Hydraulic", "Pressure Relief Valve Pack", "Air Compressor Screw Type", "Air Dryer Refrigerated",
  "Mechanical Flywheel Rig", "Epicyclic Gear Train Model", "Governor Mechanism Tester", "Whirling of Shaft Apparatus", "Journal Bearing Test Rig",

  // ==========================================
  // CIVIL ENGINEERING & SURVEYING INSTRUMENTS (701 - 800)
  // ==========================================
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

  // ==========================================
  // EDA, CAD, CAM & CAE SOFTWARE TOOLS (801 - 900)
  // ==========================================
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

  // ==========================================
  // DEEP ELECTROMECHANICAL & SENSOR MODULES (901 - 1000)
  // ==========================================
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
  "Load Cell HX711 50kg Bar", "Rotary Encoder EC11 Module", "Capacitive Touch TTP223 Board", "PIR Motion Sensor HC SR501", "RCWL 0516 Microwave Radar",
  "Raindrops Detection Sensor", "Soil Moisture Capacitive Sensor", "Turbidity Water Sensor Board", "pH Sensor Meter Electrode", "Electrical Conductivity (EC) Sensor"
];

export const PRESET_KEYWORDS = [
  // ==========================================
  // PROJECT ADJECTIVES & BUZZWORDS (1 - 100)
  // ==========================================
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

  // ==========================================
  // GENERIC COMBINATIONS & GENERAL TERMS (101 - 200)
  // ==========================================
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

  // ==========================================
  // COMPUTER SCIENCE & AI (201 - 300)
  // ==========================================
  "Artificial Intelligence", "Machine Learning", "Deep Learning", "Neural Networks", "Natural Language Processing",
  "Computer Vision", "Reinforcement Learning", "Generative AI", "Large Language Models", "Data Science",
  "Data Analytics", "Big Data", "Predictive Modeling", "Data Mining", "Data Visualization",
  "Full Stack Development", "Frontend Architecture", "Backend Engineering", "Web Application", "Mobile App Development",
  "Android Development", "iOS Development", "Cross Platform Apps", "Cloud Computing", "Amazon Web Services (AWS)",
  "Microsoft Azure", "Google Cloud Platform", "Serverless Architecture", "DevOps", "CI/CD Pipelines",
  "Docker Containers", "Kubernetes", "Microservices", "Cybersecurity", "Ethical Hacking",
  "Cryptography", "Network Security", "Penetration Testing", "Blockchain Technology", "Smart Contracts",
  "Decentralized Apps (dApps)", "Web3", "Internet of Things (IoT)", "Edge Computing", "Fog Computing",
  "Embedded Software", "Real Time Operating Systems", "Computer Architecture", "Compiler Design", "Operating Systems",
  "Database Management", "SQL Databases", "NoSQL Databases", "Graph Databases", "Object Oriented Programming",
  "Functional Programming", "Data Structures", "Algorithms Optimization", "Software Architecture", "Design Patterns",
  "Agile Methodologies", "Scrum Framework", "Git Version Control", "Linux Systems", "Shell Scripting",
  "Python Programming", "Java Programming", "C Plus Plus", "JavaScript Ecosystem", "TypeScript",
  "Rust Programming", "Go Language", "Next.js Framework", "React Library", "Angular Framework",
  "Vue.js", "Node.js Backend", "Django Framework", "Flask Microframework", "FastAPI",
  "Spring Boot", "GraphQL API", "RESTful Web Services", "UI UX Design", "Responsive Web Design",
  "Human Computer Interaction", "Virtual Reality (VR)", "Augmented Reality (AR)", "Mixed Reality", "Metaverse Development",
  "Game Development", "Unity 3D Engine", "Unreal Engine", "Computer Graphics", "Digital Audio Processing",
  "Distributed Systems", "Parallel Computing", "High Performance Computing", "Quantum Computing", "Bioinformatics",

  // ==========================================
  // TECHNICAL SUB-DOMAINS & FIELDS (301 - 400)
  // ==========================================
  "Pattern Recognition", "Anomaly Detection", "Sentiment Analysis", "Text Summarization", "Speech Recognition",
  "Object Detection", "Image Segmentation", "Face Recognition", "Gesture Recognition", "Predictive Maintenance",
  "Fraud Detection", "Recommendation Engine", "Chatbot Development", "Virtual Assistant", "Autonomous Navigation",
  "API Development", "Database Optimization", "Network Load Balancing", "Cloud Security", "Identity Access Management",
  "Vulnerability Assessment", "Malware Analysis", "Digital Forensics", "Distributed Ledgers", "NFT Development",
  "MQTT Protocol", "CoAP Protocol", "Wireless Mesh Networks", "Edge Analytics", "Real Time Streaming",
  "Data Warehousing", "ETL Pipelines", "Data Governance", "MLES (Machine Learning at Scale)", "MLOps",
  "Hyperparameter Tuning", "Model Deployment", "Feature Engineering", "Time Series Forecasting", "Cluster Analysis",
  "Semantic Web", "Knowledge Graphs", "Ontology Engineering", "Search Engine Optimization", "Web Scraping",
  "Microfrontend Architecture", "Progressive Web Apps", "Server Side Rendering", "Static Site Generation", "State Management",
  "Unit Testing", "Integration Testing", "Automated Testing", "Performance Testing", "Load Testing",
  "Linux Kernel", "Device Drivers", "Memory Management", "Process Synchronization", "File Systems",
  "Parallel Programming", "CUDA Programming", "OpenCL Development", "MPI (Message Passing Interface)", "Grid Computing",
  "Quantum Algorithms", "Quantum Cryptography", "Quantum Error Correction", "Bioinformatics Algorithms", "Genomic Data Analysis",
  "Medical Image Processing", "Healthcare Informatics", "E-Commerce Systems", "Content Management Systems", "Social Network Analysis",
  "Recommender Systems", "Collaborative Filtering", "Content Based Filtering", "Reinforcement Learning Agents", "Deep Q Networks",
  "GANs (Generative Adversarial Networks)", "Transformers Architecture", "BERT Model", "GPT Architecture", "Diffusion Models",
  "Explainable AI (XAI)", "AI Ethics", "Bias Mitigation", "Data Privacy Tech", "Federated Learning",

  // ==========================================
  // ELECTRONICS & COMMUNICATION (401 - 500)
  // ==========================================
  "VLSI Design", "ASIC Development", "FPGA Architecture", "Verilog HDL", "VHDL Simulation",
  "Embedded C", "Microcontrollers", "Microprocessors", "Arduino Prototyping", "Raspberry Pi Projects",
  "System on Chip (SoC)", "Digital Signal Processing", "Analog Signal Processing", "Image Processing", "Video Analytics",
  "Wireless Communication", "5G Networks", "6G Technologies", "Satellite Communication", "Radar Systems",
  "Antenna Design", "RF Engineering", "Electromagnetic Fields", "Optical Communication", "Fiber Optics",
  "Printed Circuit Board (PCB)", "Circuit Simulation", "LTSpice Modeling", "Analog Electronics", "Digital Electronics",
  "Power Electronics", "Inverters & Converters", "Semiconductor Devices", "Optoelectronics", "Nanoelectronics",
  "Sensor Networks", "Wireless Sensor Nodes", "MEMS Technology", "Bio Medical Instrumentation", "Signal Telemetry",
  "Telecommunication Systems", "Network Protocols", "LoRaWAN Technology", "ZigBee Networks", "Bluetooth Low Energy",
  "Cellular Networks", "Information Theory", "Coding Techniques", "Error Correction Codes", "Digital Filters",
  "Adaptive Filtering", "VLSI Verification", "CMOS Technology", "Mixed Signal Design", "RF Circuit Design",
  "Microwave Engineering", "Wave Propagation", "Signal Integrity", "Power Integrity", "Electronic Cooling",
  "Hardware Description Languages", "SystemVerilog", "Hardware Security", "Physical Design VLSI", "Logic Synthesis",
  "Static Timing Analysis", "Low Power VLSI", "Neuromorphic Computing", "Printed Electronics", "Flexible Electronics",
  "Avionics Systems", "Flight Instrumentation", "Telemetry Systems", "Instrumentation Amplifiers", "Data Acquisition Systems",
  "PLC Programming", "SCADA Systems", "Industrial Automation", "Industrial IoT (IIoT)", "Modbus Protocol",
  "CAN Bus Architecture", "Automotive Electronics", "Electric Vehicle Hardware", "Battery Management System", "Motor Controllers",
  "Sensors and Actuators", "MEMS Accelerometers", "Biosensors", "Wearable Technology", "Smart Grid Hardware",
  "Power Systems Protection", "Renewable Energy Grid", "Energy Harvesting Circuits", "Optoelectronic Sensors", "Laser Technology",

  // ==========================================
  // ECE SPECIFIC SUB-DOMAINS (501 - 600)
  // ==========================================
  "Hardware In The Loop", "Embedded Linux", "Firmware Engineering", "Bare Metal Programming", "Microcontroller Interfacing",
  "ADC Conversion", "DAC Conversion", "PWM Control", "I2C Protocol", "SPI Protocol",
  "UART Communication", "USB Interface", "Ethernet Controller", "Wi-Fi Modules", "GSM GPRS Modules",
  "GPS Tracking Hardware", "RFID Systems", "NFC Technology", "Biometric Sensors", "Fingerprint Scanners",
  "Pulse Oximeter Sensors", "ECG Signal Processing", "EEG Analysis", "EMG Controlled Systems", "Ultrasonic Transducers",
  "Infrared Sensors", "Gas Sensors", "Smoke Detectors", "Temperature Sensors", "Humidity Sensors",
  "Pressure Transducers", "Load Cells", "Relay Control Board", "Optocouplers", "Voltage Regulators",
  "Switching Power Supplies", "DC DC Converters", "AC DC Inverters", "Frequency Modulators", "Phase Locked Loops",
  "Operational Amplifiers", "Active Filters", "Passive Filters", "RF Transceivers", "Microstrip Antennas",
  "Patch Antennas", "Waveguides", "Fiber Optic Links", "Laser Diodes", "Photodetectors",
  "Solar Cell Characterization", "Supercapacitors", "Piezoelectric Harvesters", "Thermoelectric Generators", "Wireless Power Transfer",
  "Inductive Charging", "Resonant Coupling", "Li-Fi Technology", "Visible Light Communication", "Underwater Communication",
  "Acoustic Communication", "Spread Spectrum Tech", "OFDM Systems", "MIMO Architecture", "Beamforming",
  "Software Defined Radio", "Cognitive Radio Networks", "Dynamic Spectrum Access", "Network Routing Protocols", "Mesh Topology",
  "VLSI Floorplanning", "Placement & Routing", "Clock Tree Synthesis", "Design For Testability", "Built In Self Test",
  "Boundary Scan", "Fault Modeling", "Hardware Trojans", "Cryptographic Hardware", "FPGA Prototyping Board",
  "Xilinx Vivado", "Intel Quartus Prime", "ModelSim Simulation", "Cadence Virtuoso", "Synopsys Design Compiler",

  // ==========================================
  // MECHANICAL ENGINEERING (601 - 700)
  // ==========================================
  "Computer Aided Design (CAD)", "SolidWorks Modeling", "Autodesk Inventor", "CATIA Design", "Finite Element Analysis",
  "ANSYS Simulation", "Computational Fluid Dynamics", "Thermal Analysis", "Structural Analysis", "Kinematics of Machinery",
  "Dynamics of Machines", "Thermodynamics Application", "Heat and Mass Transfer", "Fluid Mechanics", "Hydraulic Systems",
  "Pneumatic Systems", "Internal Combustion Engines", "Automobile Engineering", "Aerodynamics Design", "Wind Tunnel Testing",
  "Turbomachinery", "Power Plant Engineering", "Refrigeration & AC", "HVAC Systems", "Manufacturing Processes",
  "Computer Integrated Manufacturing", "CNC Machining", "Additive Manufacturing", "3D Printing Systems", "Rapid Prototyping Hardware",
  "Material Science", "Composite Materials", "Nanomaterials Fabrication", "Metallurgy", "Mechanical Vibrations",
  "Acoustics Engineering", "Tribology & Lubrication", "Machine Design", "Product Design Engineering", "Reverse Engineering",
  "Geometric Dimensioning", "Design for Manufacturing", "Mechatronics Systems", "Electro Mechanical Design", "Robotic Actuators",
  "MEMS Fabrication", "Smart Materials", "Shape Memory Alloys", "Biomimetic Design", "Biomechanics Hardware",
  "Renewable Energy Systems", "Solar Thermal Collectors", "Wind Turbine Dynamics", "Hydroelectric Turbines", "Geothermal Systems",
  "Automotive Dynamics", "Vehicle Suspension Design", "Chassis Engineering", "Electric Vehicle Drivetrain", "Hybrid Vehicles",
  "Unmanned Aerial Vehicles", "Drone Frame Design", "Propulsion Systems", "Rocket Engineering", "Marine Engineering Systems",
  "Industrial Safety", "Ergonomics Design", "Quality Control Systems", "Six Sigma Certification", "Total Quality Management",
  "Lean Manufacturing", "Supply Chain Engineering", "Operations Research", "Maintenance Engineering", "Non Destructive Testing",
  "Welding Technology", "Metal Casting Analysis", "Sheet Metal Forming", "Plastic Injection Molding", "Tool and Die Design",
  "Robotic Grippers", "Pneumatic Actuators", "Hydraulic Pumps", "Thermofluid Systems", "Cryogenic Engineering",
  "Microfluidics Devices", "MEMS Sensors", "Stress Analysis", "Fatigue Analysis", "Fracture Mechanics",

  // ==========================================
  // MECHANICAL SUB-DOMAINS & TOOLS (701 - 800)
  // ==========================================
  "Stress Strain Analysis", "Modal Analysis", "Transient Thermal Analysis", "Steady State Thermal", "Fluid Structure Interaction",
  "Aerodynamic Lift", "Aerodynamic Drag", "Boundary Layer Flow", "Turbulent Flow Modeling", "Laminar Flow Analysis",
  "Heat Exchangers Design", "Cooling Towers", "Boiler Operation Systems", "Steam Turbines", "Gas Turbines",
  "Four Stroke Engines", "Two Stroke Engines", "Engine Emisson Control", "Catalytic Converters", "Alternative Fuels",
  "Biofuels Production", "Hydrogen Fuel Cells", "Air Conditioning Cycle", "Refrigerants Analysis", "Compressors Engineering",
  "Gears and Gearboxes", "Belts and Pulleys", "Chain Drives", "Clutches and Brakes", "Bearings and Lubricants",
  "Shafts and Couplings", "Fasteners and Joints", "Springs Mechanics", "Cam and Follower", "Linkage Mechanisms",
  "CNC Milling", "CNC Turning", "Laser Cutting Systems", "Plasma Cutting", "Waterjet Cutting",
  "Fused Deposition Modeling", "Stereolithography", "Selective Laser Sintering", "Metal 3D Printing", "Filament Characterization",
  "Powder Metallurgy", "Heat Treatment Steel", "Corrosion Prevention", "Surface Engineering", "Coatings Technology",
  "Polymer Matrix Composites", "Metal Matrix Composites", "Ceramic Matrix Composites", "Carbon Nanotubes", "Graphene Applications",
  "Vibration Isolation", "Damping Materials", "Noise Control Systems", "Shock Absorbers", "Balancing of Rotors",
  "Suspension Systems", "Steering Mechanisms", "Braking Systems Architecture", "Tire Mechanics", "Aerodynamic Wings",
  "Quadcopter Frames", "Fixed Wing Drones", "Rocket Propulsion", "Thrusters Engineering", "Underwater Vehicles ROV",
  "Material Handling Automation", "Conveyor Systems", "Automated Storage Retrieval", "Robotic Palletizing", "Ergonomic Workstations",
  "Statistical Process Control", "Failure Mode Effects", "Root Cause Analysis", "Predictive Maintenance Mechanical", "Condition Monitoring",
  "Ultrasonic Testing", "Radiographic Testing", "Magnetic Particle Testing", "Dye Penetrant Inspection", "Visual Inspection Tools",

  // ==========================================
  // CIVIL & URBAN ENGINEERING (801 - 900)
  // ==========================================
  "Structural Engineering", "Concrete Technology", "Reinforced Concrete Structures", "Steel Design Structures", "Prestressed Concrete",
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

  // ==========================================
  // AI & ROBOTICS (901 - 1000)
  // ==========================================
  "Robot Operating System (ROS)", "ROS2 Integration", "Robot Kinematics", "Robot Dynamics", "Inverse Kinematics",
  "Autonomous Mobile Robots", "Unmanned Ground Vehicles", "Humanoid Robotics", "Industrial Robots", "Collaborative Robots (Cobots)",
  "Swarm Robotics", "Drones & Quadcopters", "Autonomous Flight Control", "Simultaneous Localization", "SLAM Algorithms",
  "LiDAR Data Processing", "Sensor Fusion Algorithms", "Kalman Filtering", "Extended Kalman Filters", "Path Planning Algorithms",
  "A Star Algorithm", "Dijkstra Navigation", "Obstacle Avoidance Systems", "Robotic Vision Systems", "Object Detection Robotics",
  "3D Point Cloud Processing", "Deep Reinforcement Learning", "Robotic Gripper Design", "Soft Robotics Systems", "Biomimetic Robots",
  "Medical Robotics", "Surgical Robots", "Exoskeleton Hardware", "Prosthetics Engineering", "Teleoperation Systems",
  "Haptic Feedback Systems", "Micro Robotics", "Nano Robots", "Underwater Robotics (AUV)", "Space Robotics",
  "Robotic Simulation Tools", "Gazebo Simulator", "Webots Environment", "CoppeliaSim Platform", "MATLAB Robotics Toolbox",
  "Actuator Control Systems", "Servo Motor Control", "Stepper Motor Drivers", "Brushless DC Motors", "Robotic Joint Design",
  "IMU Sensor Integration", "Ultrasonic Range Finders", "Time of Flight Sensors", "Computer Vision Robotics", "Visual Odometry",
  "Machine Vision Inspection", "Edge AI Hardware", "NVIDIA Jetson Programming", "Google Coral Edge TPU", "TensorFlow Lite",
  "PyTorch Mobile", "OpenCV Library", "MediaPipe Framework", "Automated Guided Vehicles", "Warehouse Automation Systems",
  "Agriculture Robotics", "Smart Farming Hardware", "Robotic Harvesting", "Drone Mapping Software", "Precision Agriculture",
  "Human Robot Interaction", "Gesture Control Systems", "Voice Controlled Robots", "Brain Computer Interface", "Cognitive Robotics",
  "Evolutionary Robotics", "Genetic Algorithms Robotics", "Fuzzy Logic Controllers", "Neural Control Systems", "Adaptive Control Systems",
  "Robotic Fleet Management", "Cyber Physical Systems", "Digital Twin Technology", "Mechatronics Prototyping", "LabVIEW Automation",
  "Python Robotics Library", "C Plus Plus Robotics", "Embedded Linux Development", "Motion Control Software", "Trajectory Generation",

  // Spread all items from the extended keywords to combine them into the active preset keywords
  ...EXTENDED_KEYWORDS
];
