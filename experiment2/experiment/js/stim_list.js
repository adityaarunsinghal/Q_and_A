var stim_list = {
	"pets" :    [{"s" : "Mary is at a party making polite conversation. Susan asks: ",
                  "q" : "'Do you have a dog?'",
                  "a_name" : "Mary",
                  "q_entity" : "dog",
                  "tt": "dog_conv",
                  "a" : ["I have a dog","I have a cat", "I have an animal","I have a dalmatian"]},
                 {"s" : "Mary knows Susan's family is coming into town and she wants to impress them with a cute pet. Susan calls Mary and asks: ",
                  "q" : "'Do you have a dog?'",            
                  "a_name" : "Mary",                
                  "q_entity" : "dog",
                  "tt": "dog_pr_any",
                  "a" : ["I have a dog","I have a cat", "I have an animal","I have a dalmatian"]},
                 {"s" : "Susan is visiting Mary's house for dinner, and Mary knows she is allergic to dogs. Before coming over, Susan asks: ",
                  "q" : "'Do you have a dog?'",
                  "a_name" : "Mary",                 
                  "q_entity" : "dog",
                  "tt": "dog_info",
                  "a" : ["I have a dog","I have a cat", "I have an animal","I have a dalmatian"]}],
    "clothes":  [{"s" : "Bob's friends roped him into going to the opera with them and want to make sure he has the appropriate clothes to wear. His friend Mark asks: ",
                  "q": "'Do you have a shirt?'",
                  "a_name" : "Bob",    
                  "q_entity" : "shirt", 
                  "tt": "shirt_info",
                  "a" : ["I have a shirt", "I have some pants", "I have some clothing", "I have a button-down shirt"]},
                 {"s" : "Mark is drinking coffee at a coffee shop before going on a date and accidentally spills coffee all over his shirt. He calls his friend Bob who lives close by, explains the situation, and asks: ",
                  "q": "'Do you have a shirt?'",                 
                  "a_name" : "Bob",                     
                  "q_entity" : "shirt",
                  "tt": "shirt_pr_basic",
                  "a" : ["I have a shirt", "I have some pants", "I have some clothing", "I have a button-down shirt"]},   
                 {"s" : "Bob's school is collecting clothes to send to those in need and Bob wants to donate. Mark, who's working at the collection, asks him: ",
                  "q": "'Do you have a shirt?'",                 
                  "a_name" : "Bob",                     
                  "q_entity" : "shirt",
                  "tt": "shirt_pr_any",
                  "a" : ["I have a shirt", "I have some pants", "I have some clothing", "I have a button-down shirt"]}], 
    "foods":    [{"s" : "Steve is organizing catering for his business's annual picnic. He calls Josh, the owner of a local restaurant and asks: ",
                  "q" : "'Do you have Mexican food?'",    
                  "a_name" : "Josh",    
                  "q_entity" : "mexican food",
                  "tt": "food_info",                  
                  "a" : ["We have mexican food", "We have italian food", "We have food", "We have burritos"]},
                 {"s" : "Steve is at a party and starts to feel hungry. He tells the host, Josh, how hungry he is and asks: ",
                  "q" : "'Do you have Mexican food?'",                     
                  "a_name" : "Josh",    
                  "q_entity" : "mexican food",
                  "tt": "food_pr_any",
                  "a" : ["I have mexican food", "I have italian food", "I have food", "I have burritos"]}],
    "vehicles":  [{"s": "Jane is at a party making polite conversation. Jessica asks: ",
                   "q" : "'Do you have a car?'",
                   "a_name": "Jane",
                   "q_entity": "car",
                   "tt": "car_conv",
                   "a" : ["I have a car", "I have a truck", "I have a vechicle", "I have a sports car"]},
                  {"s" : "Jessica realizes at the last minute that she needs a ride to the airport because the train isn't running. She calls her friend Jane, explains the situation, and asks: ",
                   "q" : "'Do you have a car?'",                  
                   "a_name": "Jane",
                   "q_entity" : "car",
                   "tt": "car_pr_any",
                   "a" : ["I have a car", "I have a truck", "I have a vechicle", "I have a sports car"]},
                  {"s": "Jessica is conducting a survey on car ownership among young Americans. She calls Jane and asks: ",
                   "q" : "'Do you have a car?'",                  
                   "a_name": "Jane",
                   "q_entity" : "car",
                   "tt": "car_info",
                   "a" : ["I have a car", "I have a truck", "I have a vechicle", "I have a sports car"]}]}


