import { Link, Text, View } from "@react-pdf/renderer";
import { URL } from "url";
import { Profile } from "../types";
import { Icon } from "./icon";
import { Section } from "./section";

const cvNetworks = ["github", "linkedin"];

export function Profiles({ profiles = [] }: { profiles: Profile[] }) {
  const filteredProfiles = profiles.filter((p) => {
    if (cvNetworks.includes(p.network.toLowerCase())) return true;
    return false;
  });

  return (
    <Section title="Find me">
      {filteredProfiles.map((profile, idx) => {
        const key = `${profile.network}/${profile.username}`;
        return (
          <View
            key={key}
            style={{
              marginBottom: idx < profiles!.length ? 5 : 0,
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Icon name={profile.network.toLowerCase() as any} />
              <View
                style={{
                  marginLeft: 10,
                  width: 30,
                }}
              >
                <Text>{profile.network}</Text>
              </View>
              <Text
                style={{
                  marginLeft: 10,
                  fontStyle: "italic",
                }}
              >
                {profile.username}
              </Text>
            </View>
            <Text
              style={{
                color: "grey",
              }}
            >
              <Link src={profile.url}>{`${
                new URL(profile.url).hostname
              }${new URL(profile.url).pathname}`}</Link>
            </Text>
          </View>
        );
      })}
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Icon name={"home"} />
        <View
          style={{
            marginLeft: 10,
          }}
        >
          <Text>Personal page</Text>
        </View>
      </View>
      <Link src="https://andri.dk">andri.dk</Link>
    </Section>
  );
}
