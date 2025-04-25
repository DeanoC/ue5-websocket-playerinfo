// This is a sample code for UE5 to connect to the Electron app via WebSockets
// You can use this as a reference for implementing the UE5 side of the connection

#include "WebSocketsModule.h"
#include "IWebSocket.h"
#include "JsonObjectConverter.h"
#include "Serialization/JsonWriter.h"
#include "Serialization/JsonSerializer.h"

// Sample player stats structure
struct FPlayerStats
{
    float Health;
    float Mana;
    float Stamina;
    FVector Position;
    int32 Level;
    float Experience;

    // Additional custom stats can be added here
    UPROPERTY()
    TMap<FString, float> CustomStats;
};

class FWebSocketClient
{
public:
    // Initialize the WebSocket client
    void Initialize()
    {
        // Load the WebSockets module
        if (!FModuleManager::Get().IsModuleLoaded("WebSockets"))
        {
            FModuleManager::Get().LoadModule("WebSockets");
        }

        // Create the WebSocket connection
        WebSocket = FWebSocketsModule::Get().CreateWebSocket("ws://localhost:8080");

        // Bind event handlers
        WebSocket->OnConnected().AddLambda([this]()
        {
            UE_LOG(LogTemp, Log, TEXT("WebSocket connected to Electron app"));
            bIsConnected = true;
        });

        WebSocket->OnConnectionError().AddLambda([this](const FString& Error)
        {
            UE_LOG(LogTemp, Error, TEXT("WebSocket connection error: %s"), *Error);
            bIsConnected = false;
        });

        WebSocket->OnClosed().AddLambda([this](int32 StatusCode, const FString& Reason, bool bWasClean)
        {
            UE_LOG(LogTemp, Log, TEXT("WebSocket closed: %d %s, clean: %d"), StatusCode, *Reason, bWasClean);
            bIsConnected = false;
        });

        // Connect to the WebSocket server
        WebSocket->Connect();
    }

    // Send player stats to the Electron app
    void SendPlayerStats(const FPlayerStats& PlayerStats)
    {
        if (!bIsConnected || !WebSocket.IsValid())
        {
            return;
        }

        // Convert player stats to JSON
        TSharedPtr<FJsonObject> JsonObject = MakeShareable(new FJsonObject);
        JsonObject->SetNumberField("health", PlayerStats.Health);
        JsonObject->SetNumberField("mana", PlayerStats.Mana);
        JsonObject->SetNumberField("stamina", PlayerStats.Stamina);
        
        // Add position as a nested object
        TSharedPtr<FJsonObject> PositionObject = MakeShareable(new FJsonObject);
        PositionObject->SetNumberField("x", PlayerStats.Position.X);
        PositionObject->SetNumberField("y", PlayerStats.Position.Y);
        PositionObject->SetNumberField("z", PlayerStats.Position.Z);
        JsonObject->SetObjectField("position", PositionObject);
        
        JsonObject->SetNumberField("level", PlayerStats.Level);
        JsonObject->SetNumberField("experience", PlayerStats.Experience);

        // Add custom stats
        for (const auto& Pair : PlayerStats.CustomStats)
        {
            JsonObject->SetNumberField(Pair.Key, Pair.Value);
        }

        // Serialize JSON to string
        FString JsonString;
        TSharedRef<TJsonWriter<>> Writer = TJsonWriterFactory<>::Create(&JsonString);
        FJsonSerializer::Serialize(JsonObject.ToSharedRef(), Writer);

        // Send the JSON string to the WebSocket server
        WebSocket->Send(JsonString);
    }

    // Close the WebSocket connection
    void Close()
    {
        if (WebSocket.IsValid())
        {
            WebSocket->Close();
        }
    }

private:
    TSharedPtr<IWebSocket> WebSocket;
    bool bIsConnected = false;
};

// Example usage in a UE5 game:
// 
// In your character or player controller class:
//
// FWebSocketClient WebSocketClient;
// FPlayerStats PlayerStats;
// FTimerHandle StatsUpdateTimerHandle;
//
// void BeginPlay()
// {
//     Super::BeginPlay();
//     
//     // Initialize WebSocket client
//     WebSocketClient.Initialize();
//     
//     // Set up timer to send player stats every second
//     GetWorld()->GetTimerManager().SetTimer(
//         StatsUpdateTimerHandle,
//         this,
//         &AYourCharacterClass::SendPlayerStatsToElectron,
//         1.0f,
//         true
//     );
// }
//
// void SendPlayerStatsToElectron()
// {
//     // Update player stats from your game
//     PlayerStats.Health = GetHealth();
//     PlayerStats.Mana = GetMana();
//     PlayerStats.Stamina = GetStamina();
//     PlayerStats.Position = GetActorLocation();
//     PlayerStats.Level = GetPlayerLevel();
//     PlayerStats.Experience = GetPlayerExperience();
//     
//     // Add any custom stats
//     PlayerStats.CustomStats.Add("speed", GetMovementSpeed());
//     PlayerStats.CustomStats.Add("armor", GetArmorValue());
//     
//     // Send the stats to the Electron app
//     WebSocketClient.SendPlayerStats(PlayerStats);
// }
//
// void EndPlay(const EEndPlayReason::Type EndPlayReason)
// {
//     Super::EndPlay(EndPlayReason);
//     
//     // Clean up
//     GetWorld()->GetTimerManager().ClearTimer(StatsUpdateTimerHandle);
//     WebSocketClient.Close();
// }