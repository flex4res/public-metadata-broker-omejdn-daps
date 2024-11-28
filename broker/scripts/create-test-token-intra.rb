require 'openssl'
require 'jwt'
require 'json'

CLIENTNAME = "server"
CLIENTID = "34:20:0F:69:66:79:A3:BB:9E:AB:7D:57:24:1E:3B:A3:4B:B8:46:2A:34:20:0F:69:66:79:A3:BB:9E:AB:7D:57:24:1E:3B:A3:4B:B8:46:2A"

# Only for debugging!
filename = "../cert/#{CLIENTNAME}.key"

client_rsa_key = OpenSSL::PKey::RSA.new File.read(filename)
payload = {
  'iss' => CLIENTID,
  'sub' => CLIENTID,
  'exp' => Time.new.to_i + 3600,
  'nbf' => Time.new.to_i,
  'iat' => Time.new.to_i,
  'aud' => 'idsc:IDS_CONNECTORS_ALL',
  'referringConnector' => 'http://broker.demo',
  '@type' => 'ids:DatPayload',
  'securityProfile' => 'idsc:BASE_SECURITY_PROFILE',
  '"@context"'  => 'https://w3id.org/idsa/contexts/context.jsonld',
  'https://w3id.org/idsa/contexts/context.jsonld' => '391273c2c98c03cb37637b8e38fa6187276309564f1a8a40e093c01e419ad031'
}

token = JWT.encode payload, client_rsa_key, 'RS256'
puts token