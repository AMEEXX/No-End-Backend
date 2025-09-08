// #002B36. important color remember this color 
1. User authentication should not be at the very start rather user needs to authenticate when  it is trying to upload an Agent...rent an agent or clicking to mangae Agent...and the user button on the top left of the nav bar should inlcude the user profile details displayed as a hover ..
from the footer remove uncessary things and keep it clearn
@2. Mange agent and the threee dots not working resolve it 
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Agent, Rental } from "@/entities/all";
import { User } from "@/entities/User";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";

import AgentHeader from "../components/agent-details/AgentHeader";
import AgentStats from "../components/agent-details/AgentStats";
import AgentCapabilities from "../components/agent-details/AgentCapabilities";
import AgentPricing from "../components/agent-details/AgentPricing";
import AgentReviews from "../components/agent-details/AgentReviews";
import AgentReadme from "../components/agent-details/AgentReadme";

export default function AgentDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const agentId = searchParams.get('id');
  
  const [agent, setAgent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isRenting, setIsRenting] = useState(false);

  const loadAgentDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const agentData = await Agent.get(agentId);
      setAgent(agentData);
    } catch (error) {
      console.error("Error loading agent:", error);
    }
    setIsLoading(false);
  }, [agentId]);

  const loadUser = useCallback(async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("User not authenticated");
    }
  }, []);

  useEffect(() => {
    if (agentId) {
      loadAgentDetails();
    }
    loadUser(); // This ensures user is loaded even if agentId is not present initially or after a change
  }, [agentId, loadAgentDetails, loadUser]);

  const handleRentAgent = async (hours) => {
    if (!user || !agent) return;
    
    setIsRenting(true);
    try {
      const rentalData = {
        agent_id: agent.id,
        user_id: user.id,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + hours * 60 * 60 * 1000).toISOString(),
        total_hours: hours,
        total_cost: hours * agent.price_per_hour,
        status: "active",
        usage_stats: {
          total_requests: 0,
          total_tokens: 0,
          avg_response_time: 0
        }
      };
      
      await Rental.create(rentalData);
      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Error renting agent:", error);
    }
    setIsRenting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#002B36] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#93a1a1]"></div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen bg-[#002B36] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-[#fdf6e3] mb-4">Agent Not Found</h1>
          <Button onClick={() => navigate(createPageUrl("Marketplace"))} className="bg-[#2aa198] text-[#002B36] hover:bg-[#2aa198]/90">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#002B36] py-8">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("Marketplace"))}
            className="text-[#93a1a1] hover:text-[#fdf6e3] hover:bg-[#073642] mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <AgentHeader agent={agent} />
            <AgentReadme agent={agent} />
            <AgentCapabilities agent={agent} />
            <AgentReviews agent={agent} />
          </div>
          <div className="space-y-6 lg:sticky top-24">
            <AgentStats agent={agent} />
            <AgentPricing 
              agent={agent} 
              onRent={handleRentAgent} 
              isRenting={isRenting}
              user={user}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
